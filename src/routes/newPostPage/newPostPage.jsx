import { useEffect, useRef, useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const [slideIndex, setSlideIndex] = useState(1); // Start at the first real slide (after the first clone)
  const [width, setWidth] = useState(0);
  const slideItemRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const contentItemRef = useRef(null);

  const slides = [images[images.length - 1], ...images, images[0]];

  useEffect(() => {
    if (slideItemRef.current) {
      const width = slideItemRef.current.querySelector('.slider-item')?.clientWidth;
      if (width) {
        setWidth(width);
      }
      console.log(slideItemRef.current.clientWidth, 'total', slideItemRef.current);
      console.log(width, 'width');
    }

    if (contentItemRef.current) {
      const conWidth = contentItemRef.current.clientWidth;
      console.log(conWidth);
      const contentlen = contentItemRef.current.querySelectorAll('.btn').length;
      const tw = conWidth / contentlen;
      setContentWidth(tw);
    }
  }, []);

  const resetSliderPosition = (newIndex) => {
    const container = slideItemRef.current;
    if (container) {
      container.style.transition = 'none'; // Disable transition temporarily
      container.style.transform = `translateX(-${newIndex * width}px)`; // Reset position

      // Trigger reflow and then re-enable transition
      setTimeout(() => {
        setSlideIndex(newIndex); // Update the slide index
        container.style.transition = 'transform 0.3s ease-in-out'; // Re-enable transition
      }, 100); // Small delay to allow reflow
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (slideItemRef.current) {
        const width = slideItemRef.current.querySelector('.slider-item')?.clientWidth;
        if (width) {
          setWidth(width);
        }
      }
    };

    updateWidth(); // Set initial width on mount
    window.addEventListener('resize', updateWidth); // Update width on resize

    return () => {
      window.removeEventListener('resize', updateWidth); // Clean up on unmount
    };
  }, []);

  const handleNext = () => {
    if (slideIndex === slides.length - 1) {
      resetSliderPosition(1); // Jump to the first real slide when it reaches the end
    } else {
      setSlideIndex(slideIndex + 1);
    }
  };

  // Handle the previous slide (with infinite loop)
  const handlePrev = () => {
    if (slideIndex === 0) {
      resetSliderPosition(slides.length - 2); // Jump to the last real slide when it reaches the beginning
    } else {
      setSlideIndex(slideIndex - 1);
    }
  }

  // Trigger a reflow to reset the slider position when index changes
  useEffect(() => {
    if (slideIndex === slides.length - 1) {
      setTimeout(() => {
        resetSliderPosition(1); // Reset to first slide after reaching the end
      }, 300); // Delay to allow for the transition to complete
    } else if (slideIndex === 0) {
      setTimeout(() => {
        resetSliderPosition(slides.length - 2); // Reset to last slide after reaching the beginning
      }, 300); // Delay to allow for the transition to complete
    }
  }, [slideIndex, width]);


  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id)
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
      {  images.length > 0 ? <div className="slide-wrapper">
          <div

            className="comment-slider-container"
            ref={slideItemRef}
            style={{
              transform: `translateX(-${slideIndex * width}px)`,
              transition: 'transform 0.3s ease-in-out',
            }}

          >
            {slides.map((item, index) => (
              <div
                key={index}
                className={`slider-item ${index === slideIndex ? 'active' : ''}`}
                data-index={index}
              >
                <div className="img">
                  <img src={item} />
                </div>
                <button>Shop mattress</button>
              </div>
            ))}
          </div>
          <div className="nav-buttons">
            <div className="left-icon" onClick={handlePrev}>
              <img src="/right-arrow.png" />
            </div>
            <div className="right-icon" onClick={handleNext}>
              <img src="/right-arrow.png" />
            </div>
          </div>
        </div> :    
        
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dogyht9rh",
            uploadPreset: "socio-media",
            folder: "posts",
          }}
          setState={setImages}
        />}

    
      </div>
    </div>
  );
}

export default NewPostPage;
