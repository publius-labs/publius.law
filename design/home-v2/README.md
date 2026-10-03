# Home v2 (design source)

Source for the Publius Home redesign explored in Claude Design. The shipped homepage is `/index.html`, generated from `HomeV2.dc.html`; its images and video are in `/assets/home/`.

- `HomeV2.dc.html` — Home v2 board. `Main.dc.html` — faithful recreation of the current home page for comparison.
- `canvas.json` — board layout. `design-system/` — tokens and README derived from the live stylesheet.
- `assets/public/` — supporter logos (AWS, Innovative, Ben Franklin Technology Partners). Check each owner's brand-use rules before public use.

## Assets
The `.dc.html` files reference product screenshots, the video and the headshot as `/_blob/<id>` (stored in the design artifact). The production copies are in `/assets/home/`.

## Open items before any live use
- Replace real-case screenshots with a fictional demo matter.
- Written permission for the testimonial (quote, name, title, photo, firm).
- Confirm supporter labels (investor / sponsor / technology partner), and add the Innovative website link.
- Confirm advisor descriptions (e.g. Lektra) and the 30-day message-validation scorecard before touching the live homepage.
