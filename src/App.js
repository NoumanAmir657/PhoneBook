import React, { useState, useEffect } from 'react'
import Name from './Components/Name.js'
import Notification from './Components/Notification.js'
import Login from './Components/Login.js'
import PersonForm from './Components/PersonForm.js'
import connectionService from './services/connection'
import loginService from './services/login'

//start
const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [showPersons, setShowPerson] = useState(persons)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    connectionService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setShowPerson(initialPersons)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPersonappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      connectionService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedPersonappUser', JSON.stringify(user)
      ) 
      connectionService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleChangeName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
    setShowPerson(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const submitAction = (event) => {
    event.preventDefault()
    let foundName = persons.find((person) => newName === person.name)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (foundName === undefined){

      setNewName('')
      setNewNumber('')

      connectionService
      .create(personObject)
      .then(returnedPerson => {
        console.log(returnedPerson)
        setPersons(persons.concat(personObject))
        setShowPerson(persons.concat(personObject))
        setErrorMessage('New Person was added to the PhoneBook')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
    else{
      let flag = window.confirm(`${newName} is already in the Phonebook. Do you want to replace the old number with the new number?`)
      setNewName('')
      setNewNumber('')
      if (flag) {
        connectionService.update(foundName.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
          setShowPerson(persons.map(person => person.name !== newName ? person : returnedPerson))
          setErrorMessage(`${newName} number was changed in the PhoneBook`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Person '${newName}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    }
  }

  const deletePerson = (id) => {
    let flag
    for (let i = 0; i < persons.length; ++i){
      if (persons[i].id === id){
        flag = window.confirm(`Delete ${persons[i].name}?`)
        break
      }
    }
    
    if (flag){
      connectionService.del(id)
      setPersons(persons.filter((person) => person.id !== id))
      setShowPerson(showPersons.filter((person) => person.id !== id))
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedPersonappUser')
    window. location. reload()
  }


  return (
    <div className='body'>
      <h1>Phonebook</h1>
      <Notification message={errorMessage}/>

      {user === null ?
      <Login handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/> :
      <div>
      <h3>{user.name} logged-in</h3>
      <h3><button className='button' onClick={logout}>Logout</button></h3>
      <PersonForm newSearch={newSearch} handleSearch={handleSearch} submitAction={submitAction} newName={newName} handleChangeName={handleChangeName} newNumber={newNumber} handleChangeNumber={handleChangeNumber}/>
      </div>
      }
      
      <h2>Numbers</h2>
      <div className='list'>
      <ul>
      {showPersons.map((person,i) =>
        <Name key={i} person={person} deletePerson={() => deletePerson(person.id)}/>)}
      </ul>
      </div>
    </div>
  )
}
export default App
