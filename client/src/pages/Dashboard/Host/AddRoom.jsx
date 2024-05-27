import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";


const AddRoom = () => {
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
    return (
        <div>
            <h2 className="text-2xl text-center py-6"  >Add Room Page</h2>
            <AddRoomForm dates={dates} handleDates={handleDates} />
        </div>
    );
};

export default AddRoom;