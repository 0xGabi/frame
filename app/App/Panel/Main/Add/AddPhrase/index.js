import React from 'react'
import Restore from 'react-restore'

import link from '../../../../../link'
import svg from '../../../../../svg'

class AddPhrase extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      index: 0,
      adding: false,
      phrase: '',
      password: '',
      status: '',
      error: false
    }
    this.forms = [React.createRef(), React.createRef()]
  }

  onChange (key, e) {
    e.preventDefault()
    const update = {}
    const value = (e.target.value || '')
    // value = value === ' ' ? '' : value
    // value = value.replace(/[ \t]+/g, '_')
    // value = value.replace(/\W/g, '')
    // value = value.replace(/_/g, ' ')
    // value = value.split(' ').length > 24 ? value.substring(0, value.lastIndexOf(' ') + 1) : value // Limit to 24 words max
    update[key] = value
    this.setState(update)
  }

  onBlur (key, e) {
    e.preventDefault()
    const update = {}
    update[key] = this.state[key] || ''
    this.setState(update)
  }

  onFocus (key, e) {
    e.preventDefault()
    if (this.state[key] === '') {
      const update = {}
      update[key] = ''
      this.setState(update)
    }
  }

  next () {
    this.setState({ index: ++this.state.index })
    this.focusActive()
  }

  create () {
    this.setState({ index: ++this.state.index })
    link.rpc('createFromPhrase', this.state.phrase, this.state.password, (err, signer) => {
      if (err) {
        this.setState({ status: err, error: true })
      } else {
        this.setState({ status: 'Successful', error: false })
        setTimeout(() => {
          this.store.toggleAddAccount()
        }, 2000)
      }
    })
  }

  restart () {
    this.setState({ index: 0, adding: false, phrase: '', password: '', success: false })
    setTimeout(() => {
      this.setState({ status: '', error: false })
    }, 500)
    this.focusActive()
  }

  keyPress (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const formInput = this.forms[this.state.index]
      if (formInput) formInput.current.blur()
      if (this.state.index === 1) return this.create()
      this.next()
    }
  }

  adding () {
    this.setState({ adding: true })
    this.focusActive()
  }

  focusActive () {
    setTimeout(() => {
      const formInput = this.forms[this.state.index]
      if (formInput) formInput.current.focus()
    }, 500)
  }

  render () {
    let itemClass = 'addAccountItem addAccountItemSmart'
    if (this.state.adding) itemClass += ' addAccountItemAdding'
    return (
      <div className={itemClass} style={{ transitionDelay: (0.64 * this.props.index / 4) + 's' }}>
        <div className='addAccountItemBar addAccountItemHot' />
        <div className='addAccountItemWrap'>
          <div className='addAccountItemTop'>
            <div className='addAccountItemIcon'>
              <div className='addAccountItemIconType addAccountItemIconHot'>{svg.quote(18)}</div>
              <div className='addAccountItemIconHex addAccountItemIconHexHot' />
            </div>
            <div className='addAccountItemTopTitle'>{'Phrase'}</div>
            <div className='addAccountItemTopTitle'>{''}</div>
          </div>
          <div className='addAccountItemSummary'>{'A phrase account uses a list of words to backup and restore your account'}</div>
          <div className='addAccountItemOption'>
            <div className='addAccountItemOptionIntro' onMouseDown={() => {
              this.adding()
              if (this.store('main.connection.network') === '1') setTimeout(() => this.store.notify('hotAccountWarning'), 800)
            }}>
              {'Add Phrase Account'}
            </div>
            <div className='addAccountItemOptionSetup' style={{ transform: `translateX(-${100 * this.state.index}%)` }}>
              <div className='addAccountItemOptionSetupFrames'>
                <div className='addAccountItemOptionSetupFrame'>
                  <div className='addAccountItemOptionTitle'>{'seed phrase'}</div>
                  <div className='addAccountItemOptionInputPhrase'>
                    <textarea tabIndex={'-1'} value={this.state.phrase} ref={this.forms[0]} onChange={e => this.onChange('phrase', e)} onFocus={e => this.onFocus('phrase', e)} onBlur={e => this.onBlur('phrase', e)} onKeyPress={e => this.keyPress(e)} />
                  </div>
                  <div className='addAccountItemOptionSubmit' onMouseDown={() => this.next()}>{'Next'}</div>
                </div>
                <div className='addAccountItemOptionSetupFrame'>
                  <div className='addAccountItemOptionTitle'>{'create password'}</div>
                  <div className='addAccountItemOptionInputPhrase'>
                    <input type='password' tabIndex={'-1'} value={this.state.password} ref={this.forms[1]} onChange={e => this.onChange('password', e)} onFocus={e => this.onFocus('password', e)} onBlur={e => this.onBlur('password', e)} onKeyPress={e => this.keyPress(e)} />
                  </div>
                  <div className='addAccountItemOptionSubmit' onMouseDown={() => this.create()}>{'Create'}</div>
                </div>
                <div className='addAccountItemOptionSetupFrame'>
                  <div className='addAccountItemOptionTitle'>{this.state.status}</div>
                  {this.state.error ? <div className='addAccountItemOptionSubmit' onMouseDown={() => this.restart()}>{'try again'}</div> : null}
                </div>
              </div>
            </div>
          </div>
          <div className='addAccountItemSummary'>{''}</div>
        </div>
      </div>
    )
  }
}

export default Restore.connect(AddPhrase)
