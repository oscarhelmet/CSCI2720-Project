import React,{useEffect,useState } from 'react';
import { useParams,useNavigate,useLocation} from 'react-router-dom';


let Ldata;
function SearchLocation(){
    const [dataL, setData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    
    useEffect(() => {
    
        fetch('http://localhost:8000/query/venue?keywords='+keyword,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then((res) => res.json())
          .then((data) => {
              // console.log(data);
              setData(data);
              console.log(dataL);
              
          })
          .catch((err) => {
              console.log(err.message);
          });
    }, []);

    const Enavigate = useNavigate();
    const back = function(){
  
        Enavigate("/user");
      
    }

    if(!dataL){
        return <div>loading...</div>
    }
    Ldata = dataL;
    console.log(dataL);

    return (

    <div className='mt-5'>
        <button  className="btn btn-info m-2" onClick={()=>back()}>Back</button>
        <div>
        
          <table className="table table-striped" style={{textAlign: 'center'}}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">#venue ID</th>
                <th scope="col">venue</th>
                <th scope="col">Number of Event</th>
                
              </tr>
            </thead>
            <tbody>
              
                {dataL.map((file,index)=> <LocationTable i={index} key={index} />)} 
              
                {/* {venueInformation.map((file,index)=> <LocationTable i={index} key={index} />)}  */}

            </tbody>
          </table>

        </div>

        
    
    </div>
    )
}

function LocationTable(props){
    let i = props.i;
    const navigate = useNavigate();
    const handleClick = () => {
      navigate(`/user/`+Ldata[i].venueID);
    };
    // console.log(venueInformation[i]);
  
    return(
      <tr onClick={()=>handleClick()}>
        
          <th scope="row">{Ldata[i].venueID}</th>
          <td>{Ldata[i].venue}</td>
          <td>{Ldata[i].eventlist.length}</td>
  
      </tr>
      
    )
  
  }


// class Event extends React.Component{
  
//     render(){
//       // console.log(dataEve[0])
//       let i = this.props.i;
//       return(
     
//           <tr className='h6'>
//             <th scope="row">{Edata[i].eventID}</th>
//             <td>{Edata[i].title}</td>
//             <td>{Edata[i].date}</td>
//             <td>{Edata[i].presenter}</td>
//             <td>{Edata[i].price}</td>
//           </tr>
          
       
//       )
  
  
//     }
   
    
//   }

export default SearchLocation;