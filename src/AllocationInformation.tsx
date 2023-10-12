import './app.css'
interface IAllocationInformationProps {
    allocationNumber: number;
    byteCount: number;
}


function AllocationInformation({allocationNumber, byteCount}: IAllocationInformationProps) {
    const aByte = 8;
    return (


        <>
            <div className="allocation-container">
                <p className="allocation-text">P{allocationNumber} = {byteCount} bytes ({byteCount * aByte} bits) </p>
            </div>
        
        </>
    );



}

export default AllocationInformation;