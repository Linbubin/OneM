/**
 * Created by guangqiang on 2017/9/4.
 */

import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, ListView, Modal} from 'react-native'
import {BaseComponent} from '../../base/baseComponent'
import {connect} from 'react-redux'
import Action from '../../../actions'
import ViewPager from 'react-native-viewpager'
import action from '../../../actionCreators/reading'
import deviceInfo from '../../../utils/deviceInfo'
import Swiper from 'react-native-swiper'
import {commonStyle} from '../../../utils/commonStyle'
import ArticleList from './articleList'
import ImageViewer from 'react-native-image-zoom-viewer'
const images = [{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}, {
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]
class Reading extends BaseComponent {

  constructor(props) {
    super(props)
    this.renderPage = this.renderPage.bind(this)
    this.imgClick = this.imgClick.bind(this)
    this.state = {
      dataSource: new ViewPager.DataSource({pageHasChanged: (p1, p2) => p1 !== p2}),
      bannerList: [],
      swiperShow: false,
      modalVisible: false,
      imageIndex: 0
    }
  }

  componentDidMount() {
    Promise.all([action.readingBannerList(), action.readingArticleList()]).then(response => {
      setTimeout(() => {
        this.setState({
          bannerList: response[0].data,
          dataSource: this.state.dataSource.cloneWithPages(this.packData(response[1].data)),
          swiperShow: true
        })
      }, (10))
    })
  }

  navigationBarProps() {
    return {
      title: 'dada',
      hiddenLeftItem: true
    }
  }

  packData(data) {
    let minLength = Math.min(data.essay.length, data.serial.length, data.question.length)
    let tempArr = []
    for (var i = 0; i < minLength; i++) {
      tempArr.push([data.essay[i], data.serial[i], data.question[i]])
    }
    return tempArr
  }

  renderPage(rowData, sectionId, rowId) {
   return (
     <ArticleList key={rowId} articleData={rowData}/>
   )
  }

  imgClick(i, e) {
    this.setState({imageIndex: i, modalVisible: true})
  }

  renderImg() {
    tempArr = []
    let picArr = this.state.bannerList || []
    for (var i = 0; i < picArr.length; i++) {
      tempArr.push(
        <TouchableOpacity ref={i} key={i} onPress={this.imgClick.bind(this, i)}>
          <Image style={{height: 150}}
                 source={{uri: picArr[i].cover}}/>
        </TouchableOpacity>
      )
    }
    return tempArr
  }

  _renderModal() {
    let tempArr = this.state.bannerList.map((item, index) => {
      let obj = {}
      obj.url = item.cover
      return obj
    })
    return (
      <Modal
        visible={this.state.modalVisible}
        transparent={true}
      >
        <View style={{flex: 1}}>
          <ImageViewer
            imageUrls={tempArr}
            enableImageZoom={true}
            index={this.state.imageIndex}
            onClick={() => this.setState({modalVisible: false})}
          />
        </View>
      </Modal>
    )
  }

  _render() {
    return (
      <View style={styles.container}>
        <ScrollView
          removeClippedSubviews={false}
        >
          {
            this.state.swiperShow ? <Swiper style={styles.wrapper} height={200} autoplay loop>
              {this.renderImg()}
            </Swiper> : <View/>
          }
          <ViewPager
            dataSource={this.state.dataSource}
            renderPage={this.renderPage}
            renderPageIndicator={false}
          />
        </ScrollView>
        {this._renderModal()}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyle.white
  },
  cellStyle: {
    flexDirection: 'row',
    backgroundColor: commonStyle.green
  },
  dotStyle: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 5,
    height: 5,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDot: {
    backgroundColor: '#000',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  }
})

const _Reading = connect(
  (state) => state.reading.reading,
  Action.dispatch('reading')
)(Reading)

export default _Reading