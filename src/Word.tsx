import { AddressCreation, IWord } from "./App";
import Box from "./Box";
import './Box.css'
import './App.css'

interface IWordProps {
    box: IWord;
    color: string;
    selected: boolean;
    handleClickOnBox(box: IWord): boolean;
}



function Word({ selected, handleClickOnBox, color, box }: IWordProps) {
    return (

        <Box
            box={box}
            color={color}
            handleClickOnBox={handleClickOnBox}
            selected={selected}
        />

    );
}
export default Word;