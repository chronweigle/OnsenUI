import React from 'react';
import PropTypes from 'prop-types';
import BasicComponent from './BasicComponent.jsx';
import Util from './Util.js';

/**
 * @original ons-tabbar
 * @category tabbar
 * @tutorial react/Reference/tabbar
 * @description
 * [en] Component to display a tabbar on either the top or the bottom of a page.
 * To define the tabs and the content the property renderTabs need to be implemented, that returns an array of tabs and their content. See the example for specifics. [/en]* [ja][/ja]
 * @example

  <Page>
    <Tabbar
      onPreChange={({index}) => this.setState(index)}
      onPostChange={() => console.log('postChange')}
      onReactive={() => console.log('postChange')}
      position='bottom'
      index={this.state.index}
      renderTabs={(activeIndex, tabbar) => [
        {
          content: <TabPage title="Home" active={activeIndex === 0} tabbar={tabbar} />,
          tab: <Tab label="Home" icon="md-home" />
        },
        {
          content: <TabPage title="Settings" active={activeIndex === 1} tabbar={tabbar} />,
          tab: <Tab label="Settings" icon="md-settings" />
        }]
      }
    />
  </Page>
 */

class Tabbar extends BasicComponent {
  constructor(...args) {
    super(...args);

    const callback = (name, event) => {
      if (this.props[name]) {
        return this.props[name](event);
      }
    };
    this.onPreChange = callback.bind(this, 'onPreChange');
    this.onReactive  = callback.bind(this, 'onReactive');
    this.updateIndex = this.updateIndex.bind(this);
    const startIndex = this.props.index ? this.props.index : 0;
    this.state = {
        index:startIndex,
        lastPropIndex:startIndex
    }

  }

  componentDidMount() {
    super.componentDidMount();
    const node = this._tabbar;
    node.addEventListener('prechange', this.onPreChange);
    node.addEventListener('postchange', this.updateIndex);
    node.addEventListener('reactive', this.onReactive);
    node.onSwipe = this.props.onSwipe || null;
    if (this.props.visible !== undefined) {
      node.setTabbarVisibility(this.props.visible);
    }
  }

  componentWillUnmount() {
    const node = this._tabbar;
    node.removeEventListener('prechange', this.onPreChange);
    node.removeEventListener('postchange', this.updateIndex);
    node.removeEventListener('reactive', this.onReactive);
  }

  componentWillReceiveProps(nextProps) {
    const node = this._tabbar;

    if (nextProps.index !== this.props.index && nextProps.index !== node.getActiveTabIndex()) {
      node.setActiveTab(nextProps.index, { reject: false });
    }

    if (this.props.onSwipe !== nextProps.onSwipe) {
      node.onSwipe = nextProps.onSwipe;
    }
    if (this.props.visible !== nextProps.visible) {
      node.setTabbarVisibility(nextProps.visible);
    }
    if(nextProps.index !== this.props.index && nextProps.index !== this.state.index) {
      this.setState({
        index: nextProps.index
      });
    }
  }

  render() {
    const useProps = Object.assign({},this.props,{
      index:this.state.index
    });

    const attrs = Util.getAttrs(this, useProps, { index: 'activeIndex' });
    const tabs = this.props.renderTabs(this.state.index, this);

    if (!this.tabPages) {
      this.tabPages = tabs.map((tab) => tab.content);
    } else {
      this.tabPages[this.state.index] = tabs[this.state.index].content;
    }

    return (
      <ons-tabbar {...attrs} ref={(tabbar) => { this._tabbar = tabbar; }}>
        <div className={'tabbar__content'}>
          <div>
            {this.tabPages}
          </div>
          <div></div>
        </div>
        <div className={'tabbar'}>
          {tabs.map((tab) => tab.tab)}
          <div className='tabbar__border'></div>
        </div>
      </ons-tabbar>
    );
  }

  updateIndex(e){
    this.setState((s,p)=>{
      return Object.assign({},s,{
        index:e.index
      });
    });
    if(this.props.onPostChange)
    {
      this.props.onPostChange(e);
    }
  }
}

Tabbar.propTypes = {
  /**
   * @name index
   * @type number
   * @required
   * @description
   *  [en] The index of the tab to highlight.[/en]
   *  [ja][/ja]
   */
  index: PropTypes.number.isRequired,

  /**
   * @name renderTabs
   * @type function
   * @description
   *  [en] Function that returns an array of objects with the keys `content` and `tab`.[/en]
   *  [ja][/ja]
   */
  renderTabs: PropTypes.func.isRequired,

  /**
   * @name position
   * @type string
   * @description
   *  [en] Tabbar's position. Available values are `"bottom"` and `"top"`. Use `"auto"` to choose position depending on platform (iOS bottom, Android top). [/en]
   *  [ja][/ja]
   */
  position: PropTypes.string,

  /**
   * @name swipeable
   * @type bool
   * @description
   *  [en]Ennable swipe interaction.[/en]
   *  [ja][/ja]
   */
  swipeable: PropTypes.bool,

  /**
   * @name ignoreEdgeWidth
   * @type number
   * @description
   *  [en]Distance in pixels from both edges. Swiping on these areas will prioritize parent components such as `Splitter` or `Navigator`.[/en]
   *  [ja][/ja]
   */
  ignoreEdgeWidth: PropTypes.bool,

  /**
   * @name animation
   * @type string
   * @description
   *  [en]If this attribute is set to `"none"` the transitions will not be animated.[/en]
   *  [ja][/ja]
   */
  animation: PropTypes.oneOf(['none', 'slide']),

  /**
   * @name animationOptions
   * @type object
   * @required false
   * @description
   *  [en]Specify the animation's duration, delay and timing. E.g. `{duration: 0.2, delay: 0.4, timing: 'ease-in'}`.[/en]
   *  [ja][/ja]
   */
  animationOptions: PropTypes.object,

  /**
   * @name tabBorder
   * @type bool
   * @description
   *  [en]If true, the tabs show a dynamic bottom border. Only works for iOS since the border is always visible in Material Design.[/en]
   *  [ja][/ja]
   */
  tabBorder: PropTypes.bool,

  /**
   * @name onPreChange
   * @type function
   * @description
   *  [en]Called just before the tab is changed.[/en]
   *  [ja][/ja]
   */
  onPreChange: PropTypes.func,

  /**
   * @name onPostChange
   * @type function
   * @description
   *  [en]Called just after the tab is changed.[/en]
   *  [ja][/ja]
   */
  onPostChange: PropTypes.func,

  /**
   * @name onReactive
   * @type function
   * @description
   *  [en]Called if the already open tab is tapped again.[/en]
   *  [ja][/ja]
   */
  onReactive: PropTypes.func,

  /**
   * @name onSwipe
   * @type function
   * @description
   *  [en]Hook called whenever the user slides the tabbar. It gets a decimal index and an animationOptions object as arguments.[/en]
   *  [ja][/ja]
   */
  onSwipe: PropTypes.func,

  /**
   * @name visible
   * @type bool
   * @description
   *  [en]If true, the tabbar is shown on the screen. Otherwise, the tabbar is not shown.[/en]
   *  [ja][/ja]
   */
  visible: PropTypes.bool
};

Tabbar.defaultProps = {
  index: 0
};

export default Tabbar;
