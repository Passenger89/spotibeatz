import React from 'react'
import './SearchBar.css'
import Spotify from '../../util/Spotify'

class SearchBar extends React.Component {
  state = { term: '' }

  search = () => {
    Spotify.storeInitialSearch(this.state.term) // stores current search within Local Storage

    this.props.onSearch(this.state.term)
  }

  handleTermChange = e => {
    this.setState({ term: e.target.value })
  }

  render() {
    return (
      <div className='SearchBar'>
        <input
          placeholder='Enter A Song, Album, or Artist'
          onChange={this.handleTermChange}
          // ref={myinput => (this.input = myinput)}
        />
        <button className='SearchButton' onClick={this.search}>
          SEARCH
        </button>
      </div>
    )
  }
}

export default SearchBar
