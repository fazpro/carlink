"""Inline the Carlink AI module (src/ai/*) into index_2.html. Safe to re-run: replaces marked blocks."""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(__file__).resolve().parent
html_path = ROOT / "index_2.html"
doc = html_path.read_text(encoding="utf-8")

css = (SRC / "ai.css").read_text(encoding="utf-8")
view = (SRC / "ai.html").read_text(encoding="utf-8")
js = (SRC / "ai.js").read_text(encoding="utf-8")

SPARK = ('<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">'
         '<path d="M6.5 2.2c.15 0 .27.1.31.24l.62 2.26a2.6 2.6 0 0 0 1.85 1.85l2.26.62a.32.32 0 0 1 0 .62l-2.26.62a2.6 2.6 0 0 0-1.85 1.85l-.62 2.26a.32.32 0 0 1-.62 0l-.62-2.26a2.6 2.6 0 0 0-1.85-1.85l-2.26-.62a.32.32 0 0 1 0-.62l2.26-.62a2.6 2.6 0 0 0 1.85-1.85l.62-2.26c.04-.14.16-.24.31-.24Z"/>'
         '<path class="s2" d="M12.2 1.4c.07 0 .13.05.15.12l.24.86c.08.3.32.53.62.62l.86.24a.16.16 0 0 1 0 .3l-.86.24c-.3.09-.54.32-.62.62l-.24.86a.16.16 0 0 1-.3 0l-.24-.86a.9.9 0 0 0-.62-.62l-.86-.24a.16.16 0 0 1 0-.3l.86-.24c.3-.09.53-.32.62-.62l.24-.86c.02-.07.08-.12.15-.12Z"/>'
         '<circle class="s3" cx="12.6" cy="12.4" r="1.1"/></svg>')
ASK = ('<button class="cai-ask" type="button" title="Ask Carlink AI (⌘J)" aria-label="Ask AI" data-cai-go>'
       '<span class="cai-ask__ico">' + SPARK + '</span><span class="cai-ask__lbl">Ask AI</span></button>')
ROUTE = '<script>window.CarlinkRoutes=window.CarlinkRoutes||[];window.CarlinkRoutes.push({"re":"^ai(?:/([a-z0-9-]+))?$","view":"ai","title":"Carlink AI","section":"ai"});</script>'


def block(tag, body):
    return f"<!-- ai-{tag}:start -->{body}<!-- ai-{tag}:end -->"


def put(doc, tag, body, anchor, before=True, last=False):
    pat = re.compile(rf"<!-- ai-{tag}:start -->.*?<!-- ai-{tag}:end -->", re.S)
    if pat.search(doc):
        return pat.sub(lambda m: block(tag, body), doc, count=1)
    i = doc.rfind(anchor) if last else doc.find(anchor)
    assert i >= 0, f"anchor not found: {anchor[:40]}"
    if not before:
        i += len(anchor)
    return doc[:i] + block(tag, body) + doc[i:]


# 1. route (right after the CarlinkRoutes definition script in <head>)
first_close = doc.find("</script>") + len("</script>")
if "<!-- ai-route:start -->" not in doc:
    doc = doc[:first_close] + block("route", ROUTE) + doc[first_close:]
# 2. header button, before the search field
doc = put(doc, "ask", ASK, '<div class="topbar__right">', before=False)
# 3. styles + view, before the Home view (so the router picks the view up)
doc = put(doc, "view", "<style>\n" + css + "\n</style>\n" + view, '<main class="body view hm" data-view="home"')
# 4. script, at the very end of the document
doc = put(doc, "js", "<script>\n" + js + "\n</script>", "</body></html>", last=True)

html_path.write_text(doc, encoding="utf-8")
print("ok", len(doc))
