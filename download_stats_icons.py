import urllib.request
import os

BASE_URL = "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/mounts/icons/"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "assets", "stats")

ICONS = [
    "vitalite",
    "initiative",
    "force",
    "intelligence",
    "chance",
    "agilite",
    "prospection",
    "puissance",
    "soins",
    "critique",
    "portee",
    "resistance",
    "perfeu",
    "pereau",
    "perterre",
    "perair",
    "renvoi",
    "tacle",
    "fuite",
    "esquive-pa",
    "esquive-pm",
    "docri",
    "dommages-terre",
    "dommages-feu",
    "dommages-eau",
    "dommages-air",
    "pa",
    "pm",
    "invocations",
    "resistances-critiques",
    "dommages-poussee",
    "resistances-poussee",
    "retrait-pa",
    "retrait-pm",
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

for name in ICONS:
    url = f"{BASE_URL}{name}.png"
    dest = os.path.join(OUTPUT_DIR, f"{name}.png")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            with open(dest, "wb") as f:
                f.write(response.read())
        print(f"OK  {name}.png")
    except Exception as e:
        print(f"ERR {name}.png - {e}")

print(f"\nDone. Icons saved to: {OUTPUT_DIR}")
