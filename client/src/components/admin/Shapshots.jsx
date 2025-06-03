import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSnapshots } from '../../features/snapshot/snapshotSlice';

const Snapshots = () => {
  const dispatch = useDispatch();
  const { snapshots, loading, error } = useSelector((state) => state.snapshot);

  // State to handle modal visibility and selected image
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchSnapshots()); // Dispatch action to fetch snapshots
  }, [dispatch]);

  // Function to handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the clicked image to the state
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null); // Close the modal by clearing the selected image
  };

  if (loading) {
    return <p className="text-center">Loading snapshots...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const snapshotsToDisplay = snapshots.length ? snapshots : [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">All Snapshots</h2>

      {snapshotsToDisplay.length === 0 ? (
        <p>No snapshots available</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Snapshot Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Snapshot Image</th>
              </tr>
            </thead>
            <tbody>
              {snapshotsToDisplay.map((snapshot) => (
                <tr key={snapshot._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{snapshot.user.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(snapshot.time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {snapshot.photo !== 'user_screenshot_placeholder' ? (
                      <img
                        src={`data:image/jpeg;base64,${snapshot.photo}`}
                        alt={`Snapshot of ${snapshot.user.name}`}
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleImageClick(`data:image/jpeg;base64,${snapshot.photo}`)} // On click, open the modal with the image
                      />
                    ) : (
                      <span>No snapshot available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for full image */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
          <div className="bg-white p-4 rounded-lg max-w-xl">
            <img src={selectedImage} alt="Full Snapshot" className="w-full h-auto" />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snapshots;
