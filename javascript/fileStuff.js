function initDownload(btn) {
    window.location.href = "download.php?file=" + encodeURI(btn.id);
}