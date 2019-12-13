import { Languages } from '@common';
import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Public/AboutUs/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text, View } from 'native-base';
import React from 'react';
import { Image, ImageBackground, StatusBar } from 'react-native';

export default class extends React.Component {
    render() {
        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('PublicHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.AboutUs.aboutUs.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <ImageBackground source={require('@Asset/images/bg_in.png')} imageStyle={'cover'} style={Styles.page}>
                    <View style={Styles.pageCol}>
                        <Image source={require('@Asset/images/btn-aboutus.png')} style={Styles.pageIcon} />
                    </View>

                    <View style={Styles.overviewBg}>
                        <View style={Styles.overview}>
                            <Text style={Styles.overviewDesc}>
                              {Languages.AboutUs.aboutUsDescription}
                            </Text>

                        </View>
                    </View>
                </ImageBackground>

            </Content>

            <FooterNav />

        </Container>
    }
}
