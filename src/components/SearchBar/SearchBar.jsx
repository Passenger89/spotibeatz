import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  state = { term: '' }

  search = () => {
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
        />
        <button className='SearchButton' onClick={this.search}>
          SEARCH
        </button>
      </div>
    )
  }
}

export default SearchBar
