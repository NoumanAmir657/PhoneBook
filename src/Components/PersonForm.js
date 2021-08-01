import React from 'react'

const PersonForm = ({newSearch, handleSearch, submitAction, newName, handleChangeName, newNumber, handleChangeNumber}) => {
    return(
    <React.Fragment>
    <h3>Search By Name</h3>
      <div className='center'><input className='textField' value={newSearch} onChange={handleSearch}/></div>
      <h3>Add New</h3>
      <form onSubmit={submitAction}>
      <div className='container'>
        <div>
          Name <br></br> <input className='textField' value={newName} onChange={handleChangeName}/>
        </div>
        <div>
          Number <br></br> <input className='textField' value={newNumber} onChange={handleChangeNumber}/>
        </div>
        <div>
          <button className='button' type="submit">Add</button>
        </div>
      </div>
      </form>
      </React.Fragment>
    )
}

export default PersonForm