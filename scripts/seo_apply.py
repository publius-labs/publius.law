#!/usr/bin/env python3
"""Idempotent SEO / AI-SEO <head> injector for the compiled static pages.

The site is compiled, minified HTML (no src/ in this repo), so this script owns
canonical URLs, Open Graph / Twitter tags, JSON-LD and sitemap.xml. Re-run it
after adding or renaming a page:

    python3 scripts/seo_apply.py

It only edits what is inside <head> (between <!-- seo:begin --> / <!-- seo:end -->
plus the managed og:/twitter: tags and, for listed pages, <title>). The body is
asserted byte-identical before writing.
"""
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://publius.law"
DEFAULT_IMG = f"{BASE}/assets/og/hero-attorney-BgfVu0lT.jpg"  # 1200x630 crop (scripts/make_og_images.py)
BEGIN, END = "<!-- seo:begin -->", "<!-- seo:end -->"
ORG_ID, SITE_ID = f"{BASE}/#organization", f"{BASE}/#website"

# (file, url path, new <title> or None to keep, schema.org page type, breadcrumb trail)
PAGES = [
    ("index.html", "/", None, "WebPage", []),
    ("about/index.html", "/about/", "About Publius — The Team Behind Case Intelligence for Litigators", "AboutPage", [("About", "/about/")]),
    ("process/index.html", "/process/", "How Publius Works — From Case Files to Source-Linked Answers", "WebPage", [("Our Process", "/process/")]),
    ("practice/index.html", "/practice/", "Practice Areas — Case Intelligence for Litigation Teams | Publius", "CollectionPage", [("Practice Areas", "/practice/")]),
    ("practice/litigation/index.html", "/practice/litigation/", "Litigation Case Intelligence for Small Firms | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Litigation", "/practice/litigation/")]),
    ("practice/criminal-defense/index.html", "/practice/criminal-defense/", "Criminal Defense Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Criminal Defense", "/practice/criminal-defense/")]),
    ("practice/immigration-law/index.html", "/practice/immigration-law/", "Immigration Law Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Immigration Law", "/practice/immigration-law/")]),
    ("practice/family-law/index.html", "/practice/family-law/", "Family Law Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Family Law", "/practice/family-law/")]),
    ("practice/estate-planning/index.html", "/practice/estate-planning/", "Estate Planning Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Estate Planning", "/practice/estate-planning/")]),
    ("practice/employment-law/index.html", "/practice/employment-law/", "Employment Law Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Employment Law", "/practice/employment-law/")]),
    ("practice/bankruptcy/index.html", "/practice/bankruptcy/", "Bankruptcy Case Intelligence | Publius", "WebPage", [("Practice Areas", "/practice/"), ("Bankruptcy", "/practice/bankruptcy/")]),
    ("news/index.html", "/news/", "News — Funding, Pilots and Milestones | Publius", "CollectionPage", [("News", "/news/")]),
    ("contact/index.html", "/contact/", "Contact Publius — Questions, Pilots and Press", "ContactPage", [("Contact", "/contact/")]),
    ("demo/index.html", "/demo/", "Request a Pilot — Bring One Matter | Publius", "WebPage", [("Request a Pilot", "/demo/")]),
    ("legal-terms/index.html", "/legal-terms/", None, "WebPage", [("Legal Terms", "/legal-terms/")]),
    ("terms-of-service/index.html", "/terms-of-service/", None, "WebPage", [("Terms of Service", "/terms-of-service/")]),
]
# Pages whose og:title / og:description were stale or marketing-heavy: rebuild from <title>/description.
REBUILD_OG = {"legal-terms/index.html", "terms-of-service/index.html"}
# Internal / investor / competitive material: keep out of search indexes (see robots.txt note).
NOINDEX = ["pitch/index.html", "demo/publius_competition.html", "ROI.html", "calculator.html"] + sorted(
    str(p.relative_to(ROOT)) for p in (ROOT / "PitchDeck_HTML").glob("*.html")
)
# Not in the sitemap: noindex pages plus the unlinked calculators.
SITEMAP_EXCLUDE = {"ROI.html", "calculator.html", "404.html"}

MANAGED = re.compile(
    r'<meta[^>]*(?:property="og:(?:title|description|image|type|url|site_name|locale)"'
    r'|name="twitter:(?:card|title|description|image)")[^>]*>\s*',
    re.I,
)


# Team shown on /about/. Asserted against the page's visible HTML so schema cannot drift from it.
# (name, jobTitle as shown on the site, LinkedIn URL, relationship: "employee" or "advisor")
TEAM = [
    ("Edward Kabatsky", "Founder & CEO", "https://www.linkedin.com/in/ekabatsky/", "employee"),
    ("Neal Wojdowski", "E-Discovery and Litigation Support Expert", "https://www.linkedin.com/in/nealwojdowski", "employee"),
    ("Jason Tate", "Chief of Business Growth", "https://www.linkedin.com/in/jasonltate/", "employee"),
    ("Vitaly Leokumovich", "Advisor", "https://www.linkedin.com/in/leokumovich/", "advisor"),
    ("Arthur Osmanov", "Advisor", "https://www.linkedin.com/in/arthur-osmanov/", "advisor"),
    ("Rob Matzkin", "Advisor", "https://www.linkedin.com/in/rob-j-matzkin-06027634/", "advisor"),
]


def og_variant(path):
    """Prefer the 1200x630 crop in assets/og/ when one exists for this image."""
    if path.startswith("/assets/og/") or not path.startswith("/assets/"):
        return path
    name = Path(path).name
    return f"/assets/og/{name}" if (ROOT / "assets" / "og" / name).exists() else path


def team_nodes(body):
    nodes = []
    for name, title, url, kind in TEAM:
        assert name in body and url in body, f"team member no longer on /about/: {name}"
        node = {"@type": "Person", "@id": f"{BASE}/about/#{name.lower().replace(' ', '-')}", "name": name,
                "jobTitle": title, "sameAs": [url]}
        node["worksFor" if kind == "employee" else "affiliation"] = {"@id": ORG_ID}
        nodes.append(node)
    return nodes


def attr(tag_html, name):
    m = re.search(rf'{name}="([^"]*)"', tag_html)
    return m.group(1) if m else None


def find_meta(head, key_attr, key):
    m = re.search(rf'<meta[^>]*{key_attr}="{re.escape(key)}"[^>]*>', head, re.I)
    return attr(m.group(0), "content") if m else None


def j(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def faq_from(body):
    pairs = re.findall(r"<summary[^>]*>(.*?)</summary>\s*<p[^>]*>(.*?)</p>", body, re.S)
    assert len(pairs) >= 1, "FAQ markup not found on homepage"
    return [
        {"@type": "Question", "name": html.unescape(q).strip(),
         "acceptedAnswer": {"@type": "Answer", "text": html.unescape(a).strip()}}
        for q, a in pairs
    ]


def home_graph(title, desc, body):
    org = {
        "@type": "Organization", "@id": ORG_ID, "name": "Publius", "legalName": "Publius Legal Inc.",
        "url": f"{BASE}/", "logo": {"@type": "ImageObject", "url": f"{BASE}/assets/publius-logo-CYq_9hn7.png"},
        "description": "Publius connects scattered case files into a source-grounded matter workspace for litigators. "
                       "Publius is a legal technology provider, not a law firm, and does not provide legal advice.",
        "foundingDate": "2026-02", "email": "info@publius.law",
        "contactPoint": {"@type": "ContactPoint", "contactType": "customer support", "email": "info@publius.law", "availableLanguage": "English"},
        "founder": {"@type": "Person", "name": "Edward Kabatsky", "jobTitle": "Founder & CEO", "sameAs": ["https://www.linkedin.com/in/ekabatsky/"]},
        "sameAs": ["https://www.linkedin.com/company/publiuslegal/", "https://x.com/PubliusNews"],
    }
    site = {"@type": "WebSite", "@id": SITE_ID, "url": f"{BASE}/", "name": "Publius", "inLanguage": "en-US", "publisher": {"@id": ORG_ID}}
    app = {
        "@type": "SoftwareApplication", "@id": f"{BASE}/#product", "name": "Publius",
        "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
        "description": desc, "url": f"{BASE}/", "publisher": {"@id": ORG_ID},
        "audience": {"@type": "Audience", "audienceType": "Solo attorneys and small litigation firms"},
        "featureList": [
            "Connect documents, emails, transcripts, people, events, and dates into one matter view",
            "Ask questions across the matter and trace answers to the underlying document and passage",
            "Reuse connected case context for chronology, research, deposition, motion, and trial preparation",
        ],
    }
    page = {"@type": "WebPage", "@id": f"{BASE}/#webpage", "url": f"{BASE}/", "name": html.unescape(title),
            "description": html.unescape(desc), "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID}, "inLanguage": "en-US"}
    faq = {"@type": "FAQPage", "@id": f"{BASE}/#faq", "isPartOf": {"@id": f"{BASE}/#webpage"}, "mainEntity": faq_from(body)}
    return [org, site, app, page, faq]


def page_graph(url, ptype, title, desc, trail):
    full = BASE + url
    crumbs = [("Home", "/")] + trail
    return [
        {"@type": ptype, "@id": f"{full}#webpage", "url": full, "name": html.unescape(title),
         "description": html.unescape(desc or ""), "isPartOf": {"@id": SITE_ID}, "about": {"@id": ORG_ID},
         "inLanguage": "en-US", "breadcrumb": {"@id": f"{full}#breadcrumb"}},
        {"@type": "BreadcrumbList", "@id": f"{full}#breadcrumb",
         "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + u} for i, (n, u) in enumerate(crumbs)]},
    ]


def process_page(rel, url, new_title, ptype, trail):
    path = ROOT / rel
    raw = path.read_text(encoding="utf-8", newline="")
    head, sep, rest = raw.partition("</head>")
    assert sep, f"{rel}: no </head>"
    # Read existing values BEFORE removing our own block, so re-runs keep per-page
    # og:image / og:description / og:title instead of falling back to defaults.
    desc = find_meta(head, "name", "description")
    og_img = find_meta(head, "property", "og:image")
    og_desc = find_meta(head, "property", "og:description")
    og_title_old = find_meta(head, "property", "og:title")
    head = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?", "", head, flags=re.S)
    title_m = re.search(r"<title>(.*?)</title>", head, re.S)
    assert title_m, f"{rel}: no <title>"
    title = html.escape(new_title, quote=True) if new_title else title_m.group(1)
    if new_title:
        head = head[: title_m.start()] + f"<title>{title}</title>" + head[title_m.end():]

    og_title = title if (new_title or rel in REBUILD_OG) else (og_title_old or title)
    og_desc = desc if (rel in REBUILD_OG or not og_desc) else og_desc
    if og_img and og_img.startswith("http"):
        og_img = og_img[len(BASE):] if og_img.startswith(BASE) else og_img
    img = (urljoin(BASE + "/", og_variant(og_img)) if og_img.startswith("/") else og_img) if og_img else DEFAULT_IMG
    canon = BASE + url

    head = MANAGED.sub("", head)
    graph = home_graph(title, desc or "", rest) if rel == "index.html" else page_graph(url, ptype, title, desc, trail)
    if rel == "about/index.html":
        graph += team_nodes(rest)
    lines = [
        BEGIN,
        f'<link rel="canonical" href="{canon}"/>',
        '<meta property="og:type" content="website"/>',
        '<meta property="og:site_name" content="Publius"/>',
        '<meta property="og:locale" content="en_US"/>',
        f'<meta property="og:url" content="{canon}"/>',
        f'<meta property="og:title" content="{og_title}"/>',
        f'<meta property="og:description" content="{og_desc or ""}"/>',
        f'<meta property="og:image" content="{img}"/>',
        '<meta name="twitter:card" content="summary_large_image"/>',
        f'<meta name="twitter:title" content="{og_title}"/>',
        f'<meta name="twitter:description" content="{og_desc or ""}"/>',
        f'<meta name="twitter:image" content="{img}"/>',
        f'<script type="application/ld+json">{j({"@context": "https://schema.org", "@graph": graph})}</script>',
        END,
    ]
    out = head.rstrip("\n") + "\n" + "\n".join(lines) + "\n" + sep + rest
    assert out.partition("</head>")[2] == rest, f"{rel}: body changed"
    if out != raw:
        path.write_text(out, encoding="utf-8", newline="")
    return out != raw


def process_noindex(rel):
    path = ROOT / rel
    try:
        raw = path.read_text(encoding="utf-8", newline="")
    except UnicodeDecodeError:
        return "skipped (not utf-8)"
    head, sep, rest = raw.partition("</head>")
    if not sep:
        return "skipped (no </head>)"
    head = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?", "", head, flags=re.S)
    head = re.sub(r'<meta[^>]*name="robots"[^>]*>\s*', "", head, flags=re.I)
    out = head.rstrip("\n") + f'\n{BEGIN}<meta name="robots" content="noindex, nofollow"/>{END}\n' + sep + rest
    assert out.partition("</head>")[2] == rest
    if out != raw:
        path.write_text(out, encoding="utf-8", newline="")
        return "updated"
    return "unchanged"


def write_sitemap():
    urls = [BASE + u for _, u, *_ in PAGES]
    body = "\n".join(f"  <url><loc>{u}</loc></url>" for u in urls)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n",
        encoding="utf-8",
    )
    return len(urls)


def main():
    changed = 0
    for spec in PAGES:
        c = process_page(*spec)
        changed += c
        print(("updated  " if c else "unchanged"), spec[0])
    for rel in NOINDEX:
        print(f"noindex {process_noindex(rel):<22}", rel)
    print(f"sitemap.xml: {write_sitemap()} URLs; {changed} indexable pages changed")


if __name__ == "__main__":
    sys.exit(main())
