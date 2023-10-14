import { useEffect, useState } from 'react'
import './App.css'
import './vm.css'
import Words from './Words'

export type BitGroup = {
  bitCount: number;
  color: string;
}

export type Word = {
  bits: Bit[];
  address: string;
  color: string;
}

export type Bit = {
  address: string;
  value: number;
}

const ALLOCATION_CONSTANTS = {
  WORD_SIZE_32BIT: 4,
  WORD_SIZE_64BIT: 8,
} as const;


function getRandomColor(): string {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
}


export function createAdddress(address: number, wordSize: number, byteSize: number, baseNumber: number = 16): Word[] {
  /* 
  address : The address in which the virtual memory should start from
  wordSize : number of address words that should be present
  baseNumber : The base number (default is 16 for hexadecimal)
  */
  const bitsInWord = wordSize * byteSize;
  const addressArr: Word[] = [];
  let basePrefix = "";
  switch (baseNumber) {
    case 2:
      basePrefix = "0b";
      break;
    case 16:
      basePrefix = "0x";
      break;
    default:
      break;
  }

  for (let i = 0; i < bitsInWord; i += byteSize) {
    const wordAddress: number = address + i
    const wordAddressStr: string = basePrefix + (address + i).toString(baseNumber);
    const bits: Bit[] = [];

    for (let j = 0; j < bitsInWord; j++) {
      const bitAddress = basePrefix + (wordAddress + j).toString(baseNumber);
      bits.push({ address: bitAddress, value: 0 });
    }
    addressArr.push({
      bits,
      address: wordAddressStr,
      color: getRandomColor()
    });
  }
  return addressArr;
}



function App() {
  const [allocatedWords, setAllocatedWords] = useState<Word[]>([]);
  const [amountToAllocate, setAmountToAllocate] = useState<number>(0);
  const [words, setWords] = useState<Word[]>([]);
  const [highlightedWords, setHighlightedWords] = useState<Word[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [groupedBits, setGroupedBits] = useState<BitGroup[]>([]);


  useEffect(() => {
    setShowError(false);
  }, [amountToAllocate])


  useEffect(() => {
    console.log("words", words)
    console.log('allocatedWords', allocatedWords)
    console.log("Groupedwords", groupedBits)
  }, [words, allocatedWords, groupedBits])


  useEffect(() => {
    const words = createAdddress(12222, ALLOCATION_CONSTANTS.WORD_SIZE_32BIT, 8);
    setWords(words);

  }, [])


  function handleClickOnBox(word: Word): boolean {

    if (!allocatedWords.includes(word)) {
      // if the box is not selected we cannot highlight it
      return false;
    }

    if (highlightedWords.includes(word)) {
      // if the box is already selected, deselect it
      setHighlightedWords(highlightedWords.filter(selectedBox => selectedBox !== word))
    } else {
      // if the box is not selected, select it
      setHighlightedWords([...highlightedWords, word])
    }
    return true;
  }

  // handle the malloc click
  function handleAllocateClick() {
    let index = 0;

    if (amountToAllocate <= 4) {
      const firstWordWithAvailbeSpace = words.find((word) => {

        // Find the first index of the first available bit
        index = word.bits.findIndex((bit) => bit.value === 0)
        // Check if there is enough space for the amount of bytes
        const hasEnoughSpace = word.bits.length - index >= amountToAllocate * 8

        return index !== -1 && hasEnoughSpace;
      })

      if (!firstWordWithAvailbeSpace) {
        setShowError(true);
        return;
      }


      // Set the bits to 1 if there is enough space
      firstWordWithAvailbeSpace
        .bits
        .slice(index, index + amountToAllocate * 8)
        .map((bit) => bit.value = 1);


      // Update the state
      setWords((prevState) => {
        return prevState.map((word) => {
          if (word.address === firstWordWithAvailbeSpace.address) {
            return firstWordWithAvailbeSpace;
          } else {
            return word;
          }
        });
      });

      // If all the bits are set, add the word to the allocated words
      words.forEach((word) => {
        if (word.bits.every((bit) => bit.value !== 0)) {
          setAllocatedWords([...allocatedWords, word]);
        }
        // Else Do Nothing
      })
      // Group the words
      const groups: BitGroup[] = [{
        color: getRandomColor(),
        bitCount: getAllocatedBitCount(),
      }];
      setGroupedBits([...groupedBits, ...groups]);


    } else {
      // TODO: Need to figure out what to do if users want to allocate more than 4 bytes
      setShowError(true);
      return;
    }
  }




  // handle the free click
  function handleFreeClick() {
    const remaining = allocatedWords.filter(word => !highlightedWords.includes(word));
    setAllocatedWords(remaining);
    setHighlightedWords([]);
  }




  function getAllocatedBitCount(): number {
    return words.reduce((totalBits, word) => {
      const allocatedBits = word.bits.filter(bit => bit.value === 1);
      return totalBits + allocatedBits.length;
    }, 0);
  }



  return (
    <>
      {/* Error msg incase of too many words */}
      {showError &&
        <div className='error-container'>
          <p className='error-msg'>
            Not enough space for {amountToAllocate} words
          </p>
        </div>}
      <div className='main-frame'>

        <div>
          <h1 className='title'>Virtual Memory</h1>
          <h2>32 bit words</h2>
        </div>


        <div className='virtual-memory-container'>
          <div className="allocation-container">
            {groupedBits && groupedBits.length > 0 && groupedBits.map((group, index) => (
              <div key={index}>
                <p className="allocation-text" style={{ color: group.color }}>
                  P{index} = {group.bitCount/8} bytes ({group.bitCount} bits)
                </p>
              </div>
            ))}
          </div>

          <div className='block-container'>
            {words && words.length > 0 && words.map((word, index) => {
              const allocated = allocatedWords.includes(word);

              return (
                <>
                  <Words
                    key={index + 1}
                    box={word}
                    color={word.color}
                    handleClickOnBox={handleClickOnBox}
                    selected={allocated}
                  />
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className='alloc-buttons'>
        <div>
          <button
            className='alloc-button'
            onClick={handleFreeClick}
          >
            Free
          </button>
          <button
            className='alloc-button'
            onClick={() => handleAllocateClick()}
          >
            Malloc
          </button>
          <input
            onChange={(ev) => setAmountToAllocate(Number(ev.target.value))}
            className='input-bits'
            autoFocus
            placeholder='32'

          />
        </div>
        <p style={{ fontSize: 22 }}>Bytes</p>
      </div>



      <div className='authors'>
        Mahmood & Phil - SysMentor
      </div>
    </>
  )
}

export default App

