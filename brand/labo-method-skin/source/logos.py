# Outlined (path) SVG lockups for THE LABO METHOD · SKIN. Bebas Neue for the wordmark, Montserrat Medium for SKIN.
import sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont
D=sys.argv[1]; OUT=sys.argv[2]
bebas=TTFont(f"{D}/fonts/BebasNeue-Regular.ttf")
mont=instantiateVariableFont(TTFont(f"{D}/fonts/Montserrat.ttf"), {"wght":500})
def line(font, text, size, tracking):
    """returns (pathdata, width) for text at `size` px, tracking as fraction of size, baseline y=0, y up→down flipped"""
    gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm; sc=size/upm
    hmtx=font['hmtx']; x=0.0; d=[]
    for i,ch in enumerate(text):
        g=cmap.get(ord(ch))
        if g is None: x+=size*0.3; continue
        pen=SVGPathPen(gs); tp=TransformPen(pen,(sc,0,0,-sc,x,0)); gs[g].draw(tp)
        p=pen.getCommands()
        if p: d.append(p)
        x+=hmtx[g][0]*sc + (tracking*size if i<len(text)-1 else 0)
    return " ".join(d), x
def capheight(font,size): return font['OS/2'].sCapHeight*size/font['head'].unitsPerEm
def svg(w,h,body,color="#2C3539",bg=None):
    r=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w:.1f}" height="{h:.1f}">'
    if bg: r+=f'<rect width="100%" height="100%" fill="{bg}"/>'
    return r+f'<g fill="{color}" fill-rule="nonzero">{body}</g></svg>'
def centered(parts, pad):
    """parts: list of (path, width, height_capline, baseline_y). Stack centered; returns svg body + size"""
    W=max(p[1] for p in parts)+2*pad; body=[]; H=pad
    for path,w,cap,gap in parts:
        y=H+cap; body.append(f'<path transform="translate({(W-w)/2:.2f},{y:.2f})" d="{path}"/>'); H=y+gap
    return "".join(body), W, H+pad
# ── Primary: THE LABO METHOD / SKIN ──
S1=100; p1,w1=line(bebas,"THE LABO METHOD",S1,0.03); c1=capheight(bebas,S1)
S2=30;  p2,w2=line(mont,"SKIN",S2,0.42);  c2=capheight(mont,S2)
body,W,H=centered([(p1,w1,c1,18),(p2,w2,c2,0)],10)
open(f"{OUT}/labo-method-skin-primary.svg","w").write(svg(W,H,body))
open(f"{OUT}/labo-method-skin-primary-white.svg","w").write(svg(W,H,body,"#FFFFFF"))
# ── Stacked: THE LABO / METHOD / SKIN (boxes, tubes) ──
pa,wa=line(bebas,"THE LABO",S1,0.03); pb,wb=line(bebas,"METHOD",S1,0.03)
body,W,H=centered([(pa,wa,c1,10),(pb,wb,c1,18),(p2,w2,c2,0)],10)
open(f"{OUT}/labo-method-skin-stacked.svg","w").write(svg(W,H,body))
open(f"{OUT}/labo-method-skin-stacked-white.svg","w").write(svg(W,H,body,"#FFFFFF"))
# ── Mark: square tile with LM + SKIN (avatar, favicon, stickers) ──
pm,wm=line(bebas,"LM",150,0.02); cm=capheight(bebas,150); ps,ws=line(mont,"SKIN",18,0.42); cs=capheight(mont,18)
T=256; inner=f'<rect width="{T}" height="{T}" fill="#2C3539"/>'
inner+=f'<g fill="#FFFFFF"><path transform="translate({(T-wm)/2:.2f},{(T-cm)/2-8+cm:.2f})" d="{pm}"/><path transform="translate({(T-ws)/2:.2f},{(T-cm)/2-8+cm+26+cs:.2f})" d="{ps}"/></g>'
open(f"{OUT}/labo-method-skin-mark.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {T} {T}" width="{T}" height="{T}">{inner}</svg>')
# ── Wordmark only (single line) for narrow uses ──
body,W,H=centered([(p1,w1,c1,0)],10)
open(f"{OUT}/labo-method-wordmark.svg","w").write(svg(W,H,body))
print("ok", round(w1), round(w2))
