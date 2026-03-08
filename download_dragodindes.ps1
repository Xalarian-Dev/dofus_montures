$baseUrl = "https://www.dofuspourlesnoobs.com/uploads/1/3/0/1/13010384/custom_themes/586567114324766674/files/mounts/dragodindes"
$destDir = "public/assets/sprites/dragodindes"

$mounts = @(
    "amande.png", "rousse.png", "doree.png",
    "amande-rousse.png", "amande-doree.png", "doree-rousse.png",
    "ebene.png", "indigo.png",
    "indigo-rousse.png", "ebene-rousse.png", "amande-indigo.png", "amande-ebene.png", "doree-indigo.png", "doree-ebene.png", "ebene-indigo.png",
    "pourpre.png", "orchidee.png",
    "pourpre-rousse.png", "orchidee-rousse.png", "amande-pourpre.png", "amande-orchidee.png", "doree-pourpre.png", "doree-orchidee.png", "indigo-pourpre.png", "indigo-orchidee.png", "ebene-pourpre.png", "ebene-orchidee.png", "orchidee-pourpre.png",
    "ivoire.png", "turquoise.png",
    "ivoire-rousse.png", "turquoise-rousse.png", "amande-ivoire.png", "amande-turquoise.png", "doree-ivoire.png", "doree-turquoise.png", "indigo-ivoire.png", "indigo-turquoise.png", "ebene-ivoire.png", "ebene-turquoise.png", "ivoire-pourpre.png", "turquoise-pourpre.png", "ivoire-orchidee.png", "turquoise-orchidee.png", "ivoire-turquoise.png",
    "emeraude.png", "prune.png",
    "emeraude-rousse.png", "prune-rousse.png", "amande-emeraude.png", "prune-amande.png", "doree-emeraude.png", "prune-doree.png", "emeraude-indigo.png", "prune-indigo.png", "ebene-emeraude.png", "prune-ebene.png", "emeraude-pourpre.png", "prune-pourpre.png", "emeraude-orchidee.png", "prune-orchidee.png", "emeraude-ivoire.png", "prune-ivoire.png", "emeraude-turquoise.png", "prune-turquoise.png", "prune-emeraude.png"
)

foreach ($mount in $mounts) {
    $url = "$baseUrl/$mount"
    $dest = "$destDir/$mount"
    if (-not (Test-Path $dest)) {
        Write-Host "Downloading $url to $dest..."
        Invoke-WebRequest -Uri $url -OutFile $dest
    }
}
