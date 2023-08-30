import LottieView from "lottie-react-native"
import React, {useState,FunctionComponent} from "react"
import { Modal } from "react-native"
import animatedLogo from "../assets/Lottie/animation_ll4qp4rk.json"

export const SplashScreens =()=>{
const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true)
const closeSplashScreen=()=>setIsSplashScreenVisible(false)
return(
    <Modal visible={isSplashScreenVisible} animationType="fade">
        <LottieView
        source={animatedLogo}
        loop={false}
        autoPlay
        onAnimationFinish={closeSplashScreen}
        />
    </Modal>
)



}