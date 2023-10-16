import { Word } from "./App";
import Box from "./Box";
import './Box.css'
import './App.css'

interface IWordProps {
    word: Word;
    color: string | undefined;
    allocated: boolean;
    handleClickOnBox(box: Word): boolean;
}



function Words({ allocated, handleClickOnBox, color, word }: IWordProps) {


    return (
        <>
            <Box
                box={word}
                color={color!}
                handleClickOnBox={handleClickOnBox}
                selected={allocated}
            />
        </>

    );
}
export default Words;