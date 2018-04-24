
import React, {
  Component,
  PropTypes,
} from 'react';

import Page, {
  Example,
  Text,
} from '../../components/page/Page.jsx';

import {
  Card
} from '../../../framework/framework';

export default class CardExample extends Component {
  render() {
    return <Page title={this.props.route.name}>
      <Example>
        <Card
          imageSrc='https://www.monkeyworlds.com/wp-content/uploads/capuchin_species.jpg'
          title='This is a title'
          subtitle='This is a subtitle'
          hightlightText='Highlight'
          tooltipText='BOOM!'
          width='200px'
          height='300px'
        />
      </Example>
    </Page>
  }
}
