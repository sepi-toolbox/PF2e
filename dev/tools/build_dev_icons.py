# 데브 전용 "D" 아이콘 생성 — 운영 "P"(pwa/icon-*.png)와 동일 스타일, 별도 파일(icon-dev-*).
from PIL import Image, ImageDraw, ImageFont
GOLD=(201,168,76,255); BG=(23,19,13,255); FONT='/System/Library/Fonts/Supplemental/Georgia Bold.ttf'

def base(masked=False):
    S=512; im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    if masked:  # 풀블리드(OS가 마스킹) — 콘텐츠는 세이프존(중앙 80%)
        d.rectangle([0,0,S,S], fill=BG); ring_r=160; cap=300
    else:       # 라운드 사각, 코너 투명
        d.rounded_rectangle([0,0,S-1,S-1], radius=92, fill=BG); ring_r=188; cap=340
    cx=cy=S//2
    d.ellipse([cx-ring_r,cy-ring_r,cx+ring_r,cy+ring_r], outline=GOLD, width=7)
    f=ImageFont.truetype(FONT, cap)
    bb=d.textbbox((0,0),'D',font=f)            # 글리프 실제 bbox로 정밀 중앙
    gw=bb[2]-bb[0]; gh=bb[3]-bb[1]
    d.text((cx-bb[0]-gw/2, cy-bb[1]-gh/2),'D',font=f,fill=GOLD)
    return im

master=base(False); mmaster=base(True)
def save(im,name,size): im.resize((size,size),Image.LANCZOS).save('pwa/'+name)
save(master,'icon-dev-512.png',512)
save(master,'icon-dev-192.png',192)
save(master,'apple-touch-dev-180.png',180)
save(master,'favicon-dev-32.png',32)
save(mmaster,'icon-dev-maskable-512.png',512)
save(mmaster,'icon-dev-maskable-192.png',192)
print('생성 완료:', *[n for n in __import__('os').listdir('pwa') if 'dev' in n])
