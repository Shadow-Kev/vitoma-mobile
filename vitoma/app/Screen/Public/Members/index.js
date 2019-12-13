import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Public/Members/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text, View } from 'native-base';
import React from 'react';
import { Image, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Languages, Tools, Constants } from '@common';
import { connect } from 'react-redux';
import { getMembers } from '@redux/actions';
import { GET_MEMBERS, GET_MEMBERS_MORE } from '@redux/types';

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.page = 1;
    }

    componentWillMount() {
        this.getMembers(GET_MEMBERS, this.page)
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={Styles.btnAgent} onPress={() => {
                NavigationService.navigate('PublicMemberDetails', { member: { id: item.uuid } })
            }}>
                <Image source={{ uri: Tools.getImage([item.media], Constants.PostImage.small) }} resizeMode={'cover'} style={Styles.btnAgentImg} />
                <View style={Styles.btnAgentLocation}>
                    <Text style={Styles.btnAgentText}>{item.firstName}</Text>
                    <Text style={Styles.btnAgentCity}>{item.lastName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => item.uuid.toString() + '-' + index

    getMembers = (type, page) => {
        this.props.getMembers(type, page)
    }

    nextMembers = () => {
        this.page += 1
        this.getMembers(GET_MEMBERS_MORE, this.page)
    }

    render() {
        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#173471" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('PublicHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Members.members.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.sectionGrey}>
                    <FlatList
                        data={this.props.members}
                        keyExtractor={this.keyExtractor}
                        onEndReached={this.nextMembers}
                        renderItem={this.renderItem}
                        contentContainerStyle={Styles.agent}
                        numColumns={3}/>
                </View>

            </Content>

            <FooterNav />

        </Container>
    }
}

const mapStateToProps = ({ member }) => {
    return {
      members: member.members
    }
  }

 export default connect(mapStateToProps, { getMembers })(Index)
