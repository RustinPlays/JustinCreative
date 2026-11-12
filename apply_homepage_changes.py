from pathlib import Path
# Run at root of JustinCreative repo after adding downloads.html and admin/index.html
root=Path(__file__).resolve().parent
index=root/'index.html'; sitemap=root/'sitemap.xml'
s=index.read_text(encoding='utf-8')
old='<a href="lighting.html">Lighting</a><a href="av.html">AV + Tools</a>'
if old in s: s=s.replace(old,old+'<a href="downloads.html">Downloads</a>',1)
needle='<div class="tool-list" data-tool-list aria-live="polite"></div>'
if needle in s and 'Tools &amp; Downloads — Windows apps' not in s:
 s=s.replace(needle,needle+'\n      <p class="portfolio-more"><a class="text-link" href="downloads.html">Tools &amp; Downloads — Windows apps and web versions <span aria-hidden="true">↗</span></a></p>',1)
needle='<a href="av.html">AV + Tools</a><a href="merch.html">Merch</a>'
if needle in s:s=s.replace(needle,'<a href="av.html">AV + Tools</a><a href="downloads.html">Downloads</a><a href="merch.html">Merch</a>',1)
index.write_text(s,encoding='utf-8')
t=sitemap.read_text(encoding='utf-8')
if 'justincreative.tech/downloads' not in t:
 t=t.replace('</urlset>','  <url><loc>https://justincreative.tech/downloads</loc></url>\n</urlset>')
sitemap.write_text(t,encoding='utf-8')
print('Homepage navigation, homepage tools link and sitemap updated.')
