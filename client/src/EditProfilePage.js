import { COLORS } from "./GlobalStyles"
import { styled } from "styled-components"
import Modal from "react-modal"
import { useState } from "react"
import { availableProfileImages } from "./Utility"

export const EditProfilePage = ({ isOpen, onClose, user }) => {
    const [selectedImage, setSelectedImage] = useState()
    const [bio, setBio] = useState(user.bio || "")

    const handleForm = (e) => {
        e.preventDefault()

    const payload = {
        profilePicture: selectedImage,
        bio: bio 
    }

    fetch(`/user/${user._id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then((data) => {
        window.location.reload()
        onClose()
    })
    .catch(error => {
        console.error("There was an error updating the profile:", error)
    })
    }

    const handleImageSelect = (image) => {
        setSelectedImage(image)
    }
    const handleBioChange = (event) => {
        setBio(event.target.value)
    }
    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Edit Server Modal"
            style={modalStyles}
        >
            <StyledForm onSubmit={handleForm}>
                <ImageSelection>
                    <h3>Select a Profile Image</h3>
                    <ImageList>
                        {availableProfileImages.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={`Profile Image ${index + 1}`}
                                isSelected={selectedImage === image}
                                onClick={() => handleImageSelect(image)}
                            />
                        ))}
                    </ImageList>
                </ImageSelection>
                <label htmlFor="bio">Bio</label>
                <BioInput
                    id="bio"
                    type="text"
                    value={bio}
                    onChange={handleBioChange}
                    spellCheck="false"
                />
                <SubmitButton type="submit">Save Changes</SubmitButton>
            </StyledForm>
        </Modal>
    )
}

const modalStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(3px)",
    },
    content: {
        border: `1px solid ${COLORS.orange}`,
        background: `${COLORS.light_grey}`,
        color: "white",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "500px",
        height: "450px",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
}

const StyledForm = styled.form`
display: flex;
flex-direction: column;
`

const ImageSelection = styled.div`
text-align: center;
`

const ImageList = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 10px;
margin-top: 20px;
margin-bottom: 10px;
`

const Image = styled.img`
width: 80px;
height: 80px;
border: 4px solid ${(props) => (props.isSelected ? `${COLORS.orange}` : "transparent")};
cursor: pointer;
    &:hover {
    border-color: ${COLORS.orange};
    }
`

const BioInput = styled.textarea`
height: 100px;
margin-bottom: 10px;
`

const SubmitButton = styled.button`
background-color: ${COLORS.orange};
color: white;
border: none;
padding: 10px 20px;
cursor: pointer;
font-weight: bold;
`