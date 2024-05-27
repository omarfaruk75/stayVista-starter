import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../api/utils";
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const AddRoom = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState('Upload Image')
    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: null,
        key: 'selection'
    })
    //Date Rangel Handler
    const handleDates = item => {
        console.log(item);
        setDates(item.selection)
    }
    const { mutateAsync } = useMutation({

        mutationFn: async (roomData) => {
            const { data } = axiosSecure.post('/room', roomData)
            return data;
        },
        onSuccess: () => {
            console.log('Room Data Added Successfully');
            toast.success('Room Data Added Successfully')
            setLoading(false)
            navigate('/dashboard/my-listings')
        }
    })
    const handleSubmit = async e => {

        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const location = form.location.value;
        const title = form.title.value;
        const category = form.category.value;
        const to = dates.endDate;
        const from = dates.startDate;
        const price = parseFloat(form.price.value);
        const guests = parseFloat(form.total_guest.value);
        const bathrooms = parseFloat(form.bathrooms.value);
        const description = form.description.value;
        const bedrooms = parseFloat(form.bedrooms.value);
        const image = form.image.files[0];
        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email
        }
        try {
            const image_url = await imageUpload(image)
            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                guests,
                bathrooms,
                bedrooms,
                host,
                description,
                image: image_url
            }
            console.table(roomData);
            await mutateAsync(roomData)
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast.error(err.message);
        }
    }
    // handle Image Change
    const handlImage = image => {
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name);
    }

    return (
        <div>
            <h2 className="text-2xl text-center py-6"  >Add Room Page</h2>
            <div className=" ml-8 "> {imagePreview && <img className="rounded-full h-16 w-16" src={imagePreview} />}</div>
            <AddRoomForm
                dates={dates}
                handleDates={handleDates}
                handleSubmit={handleSubmit}
                setImagePreview={setImagePreview}
                imagePreview={imagePreview}
                handlImage={handlImage}
                imageText={imageText}
                loading={loading}
            />
        </div>
    );
};

export default AddRoom;