export async function downloadFile(track) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}tracks/download/${track._id}`
  );
  if (response.status === 200) {
    const blob = await response.blob(); // to get blob in fetch query is easier then in axios
    // we've got file as blob from server and now have to convert it in normal file and save
    // in JS we can use hook for this with creation invisible link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = track.name;
    document.body.appendChild(link);
    //imitate user's click on this link for downloading file
    link.click();
    link.remove();
  }
}
