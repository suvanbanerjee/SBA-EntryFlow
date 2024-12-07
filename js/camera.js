let stream = null;

async function capturePhoto() {
    const camera = document.getElementById('camera');
    const photoCanvas = document.getElementById('photoCanvas');
    const photoPreview = document.getElementById('photoPreview');

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        camera.style.display = 'block';
        camera.play();

        // Take photo after 3 seconds
        setTimeout(() => {
            photoCanvas.getContext('2d').drawImage(camera, 0, 0, photoCanvas.width, photoCanvas.height);
            const photoData = photoCanvas.toDataURL('image/jpeg');
            photoPreview.src = photoData;
            photoPreview.style.display = 'block';
            
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            camera.style.display = 'none';
        }, 3000);
    } catch (error) {
        alert('Error accessing camera');
        console.error(error);
    }
}