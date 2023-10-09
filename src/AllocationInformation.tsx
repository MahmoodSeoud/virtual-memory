import './app.css'
interface IAllocationInformationProps {
    allocationNumber: number;

}


function AllocationInformation({allocationNumber}: IAllocationInformationProps) {
    return (


        <>
            <div className="allocation-container">
                <p className="allocation-text">P{allocationNumber}</p>
            </div>
        
        </>
    );



}

export default AllocationInformation;