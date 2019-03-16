import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import './index.css'

class Tags extends Component {
  state = { currentTag: '' }

  componentDidMount () {
    const { tags } = this.props
    this.setState({
      currentTag: tags[0].key
    })
  }

  handleTagChange = key => {
    const { onTagChange } = this.props
    this.setState({
      currentTag: key
    })
    if (onTagChange) {
      onTagChange(key)
    }
  }

  render () {
    const { tags } = this.props
    const { currentTag } = this.state
    return (
      <ul className='Tags'>
        {
          tags.map(tag => {
            const { key, value } = tag
            return (<li className={cx('tag', { 'tag--selected': key === currentTag })} key={key} onClick={() => this.handleTagChange(key)}>
              {value}
            </li>
            )
          })
        }
      </ul>
    )
  }
}

Tags.propTypes = {
  onTagChange: PropTypes.func,
  tags: PropTypes.array.isRequired
}

Tags.defaultProps = {
  tags: []
}

export default Tags
