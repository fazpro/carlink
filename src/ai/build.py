"""Inline the Carlink AI module (src/ai/*) into index_2.html. Safe to re-run: replaces marked blocks."""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(__file__).resolve().parent
html_path = ROOT / "index_2.html"
doc = html_path.read_text(encoding="utf-8")

css = (SRC / "ai.css").read_text(encoding="utf-8")
view = (SRC / "ai.html").read_text(encoding="utf-8")
js = (SRC / "ai.js").read_text(encoding="utf-8")

SPARK = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c.4 0 .7.3.8.7l1.1 4.2a3 3 0 0 0 2.1 2.1l4.2 1.1a.8.8 0 0 1 0 1.6l-4.2 1.1a3 3 0 0 0-2.1 2.1l-1.1 4.2a.8.8 0 0 1-1.6 0l-1.1-4.2a3 3 0 0 0-2.1-2.1l-4.2-1.1a.8.8 0 0 1 0-1.6l4.2-1.1a3 3 0 0 0 2.1-2.1l1.1-4.2c.1-.4.4-.7.8-.7Z"/>'
         '<path d="M19 2.5c.2 0 .4.1.4.3l.3 1.1c.1.3.3.5.6.6l1.1.3a.4.4 0 0 1 0 .8l-1.1.3a.9.9 0 0 0-.6.6l-.3 1.1a.4.4 0 0 1-.8 0l-.3-1.1a.9.9 0 0 0-.6-.6l-1.1-.3a.4.4 0 0 1 0-.8l1.1-.3c.3-.1.5-.3.6-.6l.3-1.1c0-.2.2-.3.4-.3Z" opacity=".75"/></svg>')
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
