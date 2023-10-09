import { AddressCreation, IAddressBox } from "./App";
import Box from "./Box";
import './Box.css'

interface IWordProps {
    bytes: IAddressBox[];
    selectedbytes: IAddressBox[];
    handleClickOnBox(box: IAddressBox): boolean;
    color: string;
}



function Word({ bytes, selectedbytes, handleClickOnBox, color }: IWordProps) {
    return (
        <div className="word-container">
            {bytes && bytes.length > 0 && bytes.map((byte, index) => (
                <Box
                    color={color}
                    key={index}
                    box={byte}
                    handleClickOnBox={handleClickOnBox}
                    selected={selectedbytes.includes(byte)}
                />
            ))}
        </div>
    ); 
}
export default Word;