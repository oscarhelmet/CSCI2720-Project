import React,{useEffect} from 'react';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';


// require('react-dom');
// window.React2 = require('react');
// console.log(window.React1 === window.React2);
let venueInformation;




class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      userID: this.props.userID

    };
  }
  componentDidMount(){
    this.ReadVenue();
  }
  ReadVenue = async (event)=>{
    const response = await fetch('http://localhost:8000/venue',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
    this.setState({data:JSON.parse(await response.text())})
   

  }


  Sort = function(order){
    
    // venueInformation.Sort();
    if(order){
      venueInformation.sort((a, b) => a.eventlist.length - b.eventlist.length);
      this.setState({data:venueInformation});
      
      
    }else{
      venueInformation.sort((a, b) => b.eventlist.length - a.eventlist.length);
      this.setState({data:venueInformation});

    }

    
    
  }

  // ListEvent = (e)=>{
  //   e.preventDefault();
  //   let priceE = document.getElementById("price").value;
  //   <ShowEvent price = {priceE}/>
   
  // }
 
 

  render(){

    if(!this.state.data){
      return <div>Loading...</div>
    }
    venueInformation = this.state.data;
    
      return( 
      
      <div className='mt-5' id='hi'>
        
        <gmp-map id='map' style={{height:'500px'}} center='22.364641362732247, 114.17086003123094'  zoom="11" map-id="DEMO_MAP_ID">
          {venueInformation.map((file,index)=> <GoogleMap i={index} key={index} />)} 
              
        </gmp-map>

        <button  className="btn btn-info m-2" onClick={()=>this.Sort(true)}>Sort in ascending order</button>
        <button  className="btn btn-info m-2" onClick={()=>this.Sort(false)}>Sort in descending order</button>
        <button  className="btn btn-info m-2">Show favorite venue</button>


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
              
                {venueInformation.map((file,index)=> <LocationTable i={index} key={index} />)} 
              
                {/* {venueInformation.map((file,index)=> <LocationTable i={index} key={index} />)}  */}

            </tbody>
          </table>

        </div>
   

       <ShowEvent/>
       <ShowLocationWithName/>



        
      </div>
      
      
      )
    
    
    
  }
    
  
  
}

function GoogleMap(props){
  let i = props.i;
  let location = `${venueInformation[i].latitude},${venueInformation[i].longitude}`;
  const navigate = useNavigate();
  
  
  const handleClick = () => {
    navigate(`/user/`+venueInformation[i].venueID);
  };
  return(

    <gmp-advanced-marker position={location}title="My location" >
    </gmp-advanced-marker>

  )
  // const m = document.querySelector('gmp-advanced-marker');
  // console.log(m)

  // const map = new google.maps.Map(document.getElementById("map"), {
  //   center: { lat: 37.42, lng: -122.1 },
  //   zoom: 14,
  //   mapId: "4504f8b37365c3d0",
  // });
  // const priceTag = document.createElement("div");

  // priceTag.className = "price-tag";
  // priceTag.textContent = "$2.5M";

  // const markerView = new google.maps.marker.AdvancedMarkerView({
  //   map,
  //   position: { lat: 37.42, lng: -122.1 },
  //   content: priceTag,
  // });

  
  // return(
  // <div id='map'>
  //   <Helmet>
  //         <script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFo79INiYAHvallrV5ItA-AcucJh9E_RE&callback=console.debug&libraries=maps,marker&v=beta"></script>
  //     </Helmet>
    




  // </div>
    
  

  //   // <gmp-map style={{height:'500px'}} center='22.364641362732247, 114.17086003123094'  zoom="10" map-id="DEMO_MAP_ID">
  //   //   {/* <gmp-advanced-marker position='22.364641362732247, 114.17086003123094' title="My location">
  //   //   </gmp-advanced-marker> */}

  //   //   {venueInformation.map((file,index)=> <GoogleMap i={index} key={index} />)} 
      
  //   // </gmp-map>

  //     // <gmp-advanced-marker position={location} title="My location" >
  //     // </gmp-advanced-marker>

      

  // )

}


// class GoogleMap extends React.Component{
//   render(){
//     let location = `${this.props.latitude},${this.props.longitude}`;
//       return(
//         <gmp-map style={{height:'500px'}} center={location}  zoom="15" map-id="DEMO_MAP_ID">
//           <gmp-advanced-marker position={location} title="My location">
//           </gmp-advanced-marker>
//         </gmp-map>
//       )
//   }
// }

function ShowLocationWithName(){

    const navigateEN = useNavigate();
    const ListLocation =(e)=>{
      e.preventDefault();
      let keyword = document.getElementById("keyword").value;
      console.log("hihihih");
      navigateEN(`/user/location?keyword=`+keyword);
    }
    return(
      <form>
            <div className="form-group">
              <label for="keyword" style={{color:'white'}}>List venus that contain this keyword...</label>
              <input className="form-control" id="keyword" placeholder="Enter keyword"/>
            </div>
            <button type="submit" className="btn btn-info mt-2" onClick={(e)=>{ListLocation(e)}}>List</button>
      </form>
    )
}



function ShowEvent(){
  
 const navigateE = useNavigate();
 const ListEvent = (e)=>{
    e.preventDefault();
    let priceE = document.getElementById("price").value;
    
    navigateE(`/user/event?price=`+priceE);
  }
  
  
  return(
    <form>
          <div class="form-group">
            <label for="price" style={{color:'white'}}>List events that price is under...</label>
            <input class="form-control" id="price" placeholder="Enter price"/>
          </div>
          <button type="submit" class="btn btn-info mt-2" onClick={(e)=>{ListEvent(e)}}>List</button>
    </form>
  )
    
    
    // useEffect(() => {
    //   navigateE(`/event/`+props.price);
    // }, []);
    
  
}


function LocationTable(props){
  let i = props.i;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/user/`+venueInformation[i].venueID);
  };
  // console.log(venueInformation[i]);

  return(
    <tr onClick={()=>handleClick()}>
      
        <th scope="row">{venueInformation[i].venueID}</th>
        <td>{venueInformation[i].venue}</td>
        <td>{venueInformation[i].eventlist.length}</td>

    </tr>
    
  )

}

// function LocationDetail(){

  
//   const { id } = useParams();

 
//   return(
//     <div className='mt-5'>
//         {id}
//     </div>
//   )


// }







// class LocationTable extends React.Component{

  
  
//   render(){
    
//     let i = this.props.i;
//     const navigate = useNavigate();
//     const handleClick = () => {
      
//       navigate('/location ');
//     };
//       return(
//         <tr>
          
//             <th scope="row">{venueInformation[i].venueID}</th>
//             <td>{venueInformation[i].venue}</td>
//             <td>{venueInformation[i].eventlist.length}</td>
    
//         </tr>
        
//       )
//   }
// }

export default UserPage;