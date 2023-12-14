import React from 'react';




let venueInformation;




class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
     
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
 

  render(){
    if(!this.state.data){
      return <div>Loading...</div>
    }
    venueInformation = this.state.data;

    
      return( 



      <div>
        
        <button  className="btn btn-info m-2" onClick={()=>this.Sort(true)}>Sort in ascending order</button>
        <button  className="btn btn-info m-2" onClick={()=>this.Sort(false)}>Sort in descending order</button>


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
        
      </div>
      
      
      )
    
    
    
  }
    
  
  
}




class LocationTable extends React.Component{

  
  
  render(){
    
    let i = this.props.i;

      return(
        
          <tr >
            <th scope="row">{venueInformation[i].venueID}</th>
            <td>{venueInformation[i].venue}</td>
            <td>{venueInformation[i].eventlist.length}</td>
          </tr>
        
        
      )
  }
}

export default UserPage;

