import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import html2canvas from 'html2canvas';
import { uploadSnapshot } from '../features/snapshot/snapshotSlice'; // Import the action to upload snapshot

const ScreenshotCapture = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions

  // Function to capture the screenshot and dispatch it to the backend
  const captureScreenshot = async () => {
    try {
      // Capture the screenshot with transparent background
      const canvas = await html2canvas(document.body, {
        backgroundColor: 'transparent',  // Make the background transparent
        useCORS: true,  // Enable cross-origin image handling if needed
      });

      const base64Screenshot = canvas.toDataURL('image/png');
      console.log('Captured Base64 Screenshot:', base64Screenshot); // Log the Base64 screenshot for debugging

      if (!base64Screenshot || base64Screenshot === 'data:,') {
        console.error('Screenshot capture failed or returned empty data.');
        return; // If the screenshot is null or empty, don't send it to the backend
      }

      // Dispatch the action to upload the Base64 screenshot to the backend
      dispatch(uploadSnapshot(base64Screenshot)); // Dispatching the action

    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  // Capture the screenshot every 10 seconds
  useEffect(() => {
    const interval = setInterval(captureScreenshot, 10000); // Capture every 10 seconds
    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, [dispatch]);

  return <div></div>;
};

export default ScreenshotCapture;
