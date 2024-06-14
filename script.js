let mediaRecorder;
let recordedChunks = [];
const videoElement = document.getElementById('videoElement');
const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const downloadBtn = document.getElementById('downloadVideo');

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
downloadBtn.addEventListener('click', downloadVideo);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true
        });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (e) {
            recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            videoElement.src = url;
            downloadBtn.href = url;
            downloadBtn.download = 'recorded-video.webm';
            downloadBtn.disabled = false;
        };

        mediaRecorder.start();

        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
    } catch (error) {
        console.error('Error accessing media devices: ', error);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
}

function downloadVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded-video.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
