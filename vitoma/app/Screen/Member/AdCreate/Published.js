import { Languages } from '@common';
import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Member/AdCreate/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text } from 'native-base';
import React from 'react';
import { StatusBar, View } from 'react-native';

export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#173471" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('MemberAdCreate')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.AdPublished.published.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>

            <Content style={Styles.layoutInner} contentContainerStyle={Style.layoutContent}>


                <View style={Styles.publish}>
                    <Icon active name='ios-checkmark-circle-outline' style={Styles.publishIcon} type="Ionicons" />
                    <Text style={Styles.publishTitle}>{Languages.AdPublished.congratulations}</Text>
                    <Text style={Styles.publishDesc}>{Languages.AdPublished.successfulyPublished}</Text>
                    <View style={Styles.publishPreview}>
                        <Button iconLeft transparent style={Styles.publishBtn} onPress={() => {
                            NavigationService.navigate('PublicAdsDetail', this.props.navigation.state.params)
                        }}>
                            <Icon name="eye" type="FontAwesome" style={Styles.publishBtnIcon} />
                            <Text style={Styles.publishBtnText}>{Languages.AdPublished.preview}</Text>
                        </Button>
                    </View>
                </View>

            </Content>

            <FooterNav />

        </Container>
    }
}
