import React,{useEffect,useState } from 'react';
import { useParams,useNavigate,useLocation} from 'react-router-dom';


let Edata;
function EventPage(){
    const [dataE, setData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const price = queryParams.get('price');
    
    useEffect(() => {
    
        fetch('http://localhost:8000/event?price='+price,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then((res) => res.json())
          .then((data) => {
              // console.log(data);
              setData(data);
              
          })
          .catch((err) => {
              console.log(err.message);
          });
    }, []);

    const Enavigate = useNavigate();
    const back = function(){
  
        Enavigate("/user");
      
    }

    if(!dataE){
        return <div>loading...</div>
    }
    Edata = dataE;
    console.log(Edata);

    return (

    <div className='mt-5'>
        <button  className="btn btn-info m-2" onClick={()=>back()}>Back</button>
        <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">EventID</th>
            <th scope="col">Event title</th>
            <th scope="col">Event date</th>
            <th scope="col">Presenter</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
        
          {dataE.map((file,index)=> <Event i={index} key={index} />)} 
          
          
        </tbody>
      </table>

        
    
    </div>
    )
}


class Event extends React.Component{
  
    render(){
      // console.log(dataEve[0])
      let i = this.props.i;
      return(
     
          <tr className='h6'>
            <th scope="row">{Edata[i].eventID}</th>
            <td>{Edata[i].title}</td>
            <td>{Edata[i].date}</td>
            <td>{Edata[i].presenter}</td>
            <td>{Edata[i].price}</td>
          </tr>
          
       
      )
  
  
    }
   
    
  }

export default EventPage;