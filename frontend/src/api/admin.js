import axios from "axios";

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("name", "John Doe");
  formData.append("speciality", "Hair Stylist");
  formData.append("image", selectedImageFile); // selectedImageFile should be a File object

  try {
    const response = await axios.post("/api/admin/add-professional", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: yourAuthToken, // replace with actual token if needed
      },
    });

    console.log("Success:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};
