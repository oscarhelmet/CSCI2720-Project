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



      <div className='mt-5'>
        
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
       
        {/* <form>
          <div class="form-group">
            <label for="price" style={{color:'white'}}>List events that price is under...</label>
            <input class="form-control" id="price" placeholder="Enter price"/>
          </div>
          <button type="submit" class="btn btn-info mt-2" onClick={(e)=>{this.ListEvent(e)}}>List</button>
       </form> */}

       <ShowEvent/>


        
      </div>
      
      
      )
    
    
    
  }
    
  
  
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