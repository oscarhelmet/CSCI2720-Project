// "use client";
import React,{useEffect,useState } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import './LocationDetail.css';
// import {APIProvider,Map,AdvancedMarker,Pin,InfoWindow} from '@vis.gl/react-google-maps';




let dataEve;

function LocationDetail(){
 

  const [dataL, setData] = useState(null);
  const { id } = useParams();
  useEffect(() => {
  
      fetch('http://localhost:8000/venue/'+id,{
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

  // console.log(dataL[0].venue);

  const navigate = useNavigate();
  const back = function(){
  
    navigate("/user");
  
  }
 
  if(!dataL){
    return<div>loading...</div>
  }else{
    dataEve = dataL[0].eventlist;
    // console.log(dataEve)
  }
    
  
  
  return(
      
      <div className='mt-5'>
        <button  className="btn btn-info m-2" onClick={()=>back()}>Back</button>
        <GoogleMap latitude={dataL[0].latitude} longitude={dataL[0].longitude}/>
        <div className='ContentVenue'>
            <div>
               The Name of Venue: {dataL[0].venue}
            </div>

            <div className="row">
          
                <div className='col'>

                    <table className="table table-striped" style={{textAlign: 'center'}}>
                    <thead className="thead-dark">
                    
                    </thead>
                    <tbody>
                      
                        {dataL[0].eventlist.map((file,index)=> <Event i={index} key={index} />)} 
                      

                    </tbody>
                  </table>
              </div>
              <div className="col">
                  
                  <form>
                    <div className="mb-3">
                      <label for="new-comment" class="form-label">Comment:</label>
                      <textarea class="form-control" id="new-comment" rows="3"></textarea>
                    </div>
                
                    <button type="button" class="btn btn-primary" onclick="modifythisone!">Add comment</button>
          
                    </form>

                    <Comment/>
              </div>
          </div>
        </div>
      </div>
  
 
  )


}
class Comment extends React.Component{
    render(){
      return (<div>Comment here...</div>)
      
    }
}

class Event extends React.Component{
  
  render(){
    // console.log(dataEve[0])
    let i = this.props.i;
    return(
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
        <tr className='h6'>
          <th scope="row">{dataEve[i].eventID}</th>
          <td>{dataEve[i].title}</td>
          <td>{dataEve[i].date}</td>
          <td>{dataEve[i].presenter}</td>
          <td>{dataEve[i].price}</td>
        </tr>
        
      </tbody>
    </table>
    )


  }
 
  
}

// function GoogleMap(props){
//  const loc = {lat: props.latitude,lng:props.longitude};
//  return(
//   <APIProvider apiKey='AIzaSyAFo79INiYAHvallrV5ItA-AcucJh9E_RE'>
//       <div>hi</div>
//  </APIProvider>)
// }

class GoogleMap extends React.Component{
  render(){
    let location = `${this.props.latitude},${this.props.longitude}`;
      return(
        <gmp-map style={{height:'500px'}} center={location}  zoom="15" map-id="DEMO_MAP_ID">
          <gmp-advanced-marker position={location} title="My location">
          </gmp-advanced-marker>
        </gmp-map>
      )
  }
}




export default LocationDetail;

