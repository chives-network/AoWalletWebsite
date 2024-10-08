// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Button from '@mui/material/Button'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { GetMyLastMsg, AoCreateProcessAuto, sleep } from '@/functions/AoConnect/AoConnect'
import { AoLoadBlueprintChatroom, GetChatroomMembers, RegisterChatroomMember, SendMessageToChatroom } from '@/functions/AoConnect/Chatroom'
import { ansiRegex } from '@configs/functions'

const Chatroom = ({auth} : any) => {
  // ** Hook
  const { t } = useTranslation()

  const currentAddress = auth?.address as string

  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [toolInfo, setToolInfo] = useState<any>()

  const handleSimulatedChatroom = async function () {
    
    setIsDisabledButton(true)
    setToolInfo(null)
    
    const ChatroomProcessTxId = await AoCreateProcessAuto(globalThis.arweaveWallet)
    if(ChatroomProcessTxId) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        ChatroomProcessTxId: ChatroomProcessTxId
      }))
    }

    const UserOne = await AoCreateProcessAuto(globalThis.arweaveWallet)
    if(UserOne) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserOne: UserOne
      }))
    }

    const UserTwo = await AoCreateProcessAuto(globalThis.arweaveWallet)
    if(UserTwo) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserTwo: UserTwo
      }))
    }

    const UserThree = await AoCreateProcessAuto(globalThis.arweaveWallet)
    if(UserThree) {
      setToolInfo((prevState: any)=>({
        ...prevState,
        UserThree: UserThree
      }))
    }

    setTimeout(async () => {
      
      //Delay 5s code begin

      let LoadBlueprintChatroom: any = await AoLoadBlueprintChatroom(globalThis.arweaveWallet, ChatroomProcessTxId);
      while(LoadBlueprintChatroom && LoadBlueprintChatroom.status == 'ok' && LoadBlueprintChatroom.msg && LoadBlueprintChatroom.msg.error)  {
        sleep(6000)
        LoadBlueprintChatroom = await AoLoadBlueprintChatroom(globalThis.arweaveWallet, ChatroomProcessTxId);
        console.log("handleSimulatedToken LoadBlueprintChatroom:", LoadBlueprintChatroom);
      }
      if(LoadBlueprintChatroom) {
        console.log("LoadBlueprintChatroom", LoadBlueprintChatroom)
        if(LoadBlueprintChatroom?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintChatroom?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintChatroom: formatText
          }))
        }
      }
      console.log("LoadBlueprintChatroom", LoadBlueprintChatroom)

      /*
      const LoadBlueprintChat: any = await AoLoadBlueprintChat(globalThis.arweaveWallet, ChatroomProcessTxId)
      if(LoadBlueprintChat) {
        console.log("LoadBlueprintChat", LoadBlueprintChat)
        if(LoadBlueprintChat?.msg?.Output?.data?.output)  {
          const formatText = LoadBlueprintChat?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            LoadBlueprintChat: formatText
          }))
        }
      }
      */

      const ChatroomMembers1st = await GetChatroomMembers(globalThis.arweaveWallet, ChatroomProcessTxId)
      if(ChatroomMembers1st) {
        console.log("ChatroomMembers1st", ChatroomMembers1st)
        if(ChatroomMembers1st?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers1st?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers1st: formatText
          }))
        }
      }

      const UserOneRegisterData = await RegisterChatroomMember(globalThis.arweaveWallet, ChatroomProcessTxId, UserOne)
      if(UserOneRegisterData) {
        console.log("UserOneRegisterData", UserOneRegisterData)
        if(UserOneRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserOneRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserOneRegister: formatText
            }))

            //Read message from inbox
            const UserOneInboxData = await GetMyLastMsg(globalThis.arweaveWallet, UserOne)
            if(UserOneInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserOneInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserOneRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers2nd = await GetChatroomMembers(globalThis.arweaveWallet, ChatroomProcessTxId)
      if(ChatroomMembers2nd) {
        console.log("ChatroomMembers2nd", ChatroomMembers2nd)
        if(ChatroomMembers2nd?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers2nd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers2nd: formatText
          }))
        }
      }

      const UserTwoRegisterData = await RegisterChatroomMember(globalThis.arweaveWallet, ChatroomProcessTxId, UserTwo)
      if(UserTwoRegisterData) {
        console.log("UserTwoRegisterData", UserTwoRegisterData)
        if(UserTwoRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserTwoRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserTwoRegister: formatText
            }))

            //Read message from inbox
            const UserTwoInboxData = await GetMyLastMsg(globalThis.arweaveWallet, UserTwo)
            if(UserTwoInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserTwoInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserTwoRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers3rd = await GetChatroomMembers(globalThis.arweaveWallet, ChatroomProcessTxId)
      if(ChatroomMembers3rd) {
        console.log("ChatroomMembers3rd", ChatroomMembers3rd)
        if(ChatroomMembers3rd?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers3rd?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers3rd: formatText
          }))
        }
      }

      const UserThreeRegisterData = await RegisterChatroomMember(globalThis.arweaveWallet, ChatroomProcessTxId, UserThree)
      if(UserThreeRegisterData) {
        console.log("UserThreeRegisterData", UserThreeRegisterData)
        if(UserThreeRegisterData?.msg?.Output?.data?.output)  {
          const formatText = UserThreeRegisterData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {

            setToolInfo((prevState: any)=>({
              ...prevState,
              UserThreeRegister: formatText
            }))

            //Read message from inbox
            const UserThreeInboxData = await GetMyLastMsg(globalThis.arweaveWallet, UserThree)
            if(UserThreeInboxData?.msg?.Output?.data?.output)  {
              const formatText2 = UserThreeInboxData?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                setToolInfo((prevState: any)=>({
                  ...prevState,
                  UserThreeRegister: formatText2
                }))
              }
            }

          }

        }
      }

      const ChatroomMembers4th = await GetChatroomMembers(globalThis.arweaveWallet, ChatroomProcessTxId)
      if(ChatroomMembers4th) {
        console.log("ChatroomMembers4th", ChatroomMembers4th)
        if(ChatroomMembers4th?.msg?.Output?.data?.output)  {
          const formatText = ChatroomMembers4th?.msg?.Output?.data?.output.replace(ansiRegex, '');
          setToolInfo((prevState: any)=>({
            ...prevState,
            ChatroomMembers4th: formatText
          }))
        }
      }

      const SendMessageToChatroomDataUserOne = await SendMessageToChatroom(globalThis.arweaveWallet, ChatroomProcessTxId, UserOne, "001 Msg from UserOne ["+UserOne+"]")
      if(SendMessageToChatroomDataUserOne) {
        console.log("SendMessageToChatroomDataUserOne", SendMessageToChatroomDataUserOne)
        if(SendMessageToChatroomDataUserOne?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserOne?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserOne formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserOneSendMessage: formatText
          }))
        }
      }

      const SendMessageToChatroomDataUserTwo = await SendMessageToChatroom(globalThis.arweaveWallet, ChatroomProcessTxId, UserTwo, "002 Msg from UserTwo ["+UserTwo+"]")
      if(SendMessageToChatroomDataUserTwo) {
        console.log("SendMessageToChatroomDataUserTwo", SendMessageToChatroomDataUserTwo)
        if(SendMessageToChatroomDataUserTwo?.msg?.Messages && SendMessageToChatroomDataUserTwo?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserTwo?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserTwo formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserTwoSendMessage: formatText
          }))
        }
      }

      const SendMessageToChatroomDataUserThree = await SendMessageToChatroom(globalThis.arweaveWallet, ChatroomProcessTxId, UserThree, "003 Msg from UserThree ["+UserThree+"]")
      if(SendMessageToChatroomDataUserThree) {
        console.log("SendMessageToChatroomDataUserThree", SendMessageToChatroomDataUserThree)
        if(SendMessageToChatroomDataUserThree?.msg?.Messages && SendMessageToChatroomDataUserThree?.msg?.Messages[0]?.Data)  {
          const formatText = SendMessageToChatroomDataUserThree?.msg?.Messages[0]?.Data.replace(ansiRegex, '');
          console.log("SendMessageToChatroomDataUserThree formatText", formatText)
          setToolInfo((prevState: any)=>({
            ...prevState,
            UserThreeSendMessage: formatText
          }))
        }
      }
      
      //Delay 1s code end
      setIsDisabledButton(false)

    }, 5000);

    

    

  }

  return (
    <Fragment>
      {currentAddress ?
      <Grid container>
        <Grid item xs={12}>
          <Card>
              <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button sx={{ textTransform: 'none', m: 2, }} size="small" disabled={isDisabledButton} variant='outlined' onClick={
                      () => { handleSimulatedChatroom() }
                  }>
                  {t("Simulated Chatroom")}
                  </Button>
                  <Link sx={{mt: 2, mr: 2}} href={`https://github.com/chives-network/AoWalletWebsite/blob/main/blueprints/chatroom.lua`} target='_blank'>
                      <Typography variant='body2'>
                        {t("Chatroom Lua")}
                      </Typography>
                  </Link>
              </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{my: 2}}>
          <Card>
              <Grid item sx={{ display: 'column', m: 2 }}>
                <Grid sx={{my: 2}}>
                  <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>CurrentAddress:</Typography>
                  <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{currentAddress}</Typography>
                </Grid>

                {toolInfo && Object.keys(toolInfo).map((Item: any, Index: number)=>{

                  return (
                    <Fragment key={Index}>
                      <Tooltip title={toolInfo[Item]}>
                        <Grid sx={{my: 2}}>
                          <Typography noWrap variant='body2' sx={{display: 'inline', mr: 1}}>{Item}:</Typography>
                          <Typography noWrap variant='body2' sx={{display: 'inline', color: 'primary.main'}}>{toolInfo[Item]}</Typography>
                        </Grid>
                      </Tooltip>
                    </Fragment>
                  )

                })}


              </Grid>
          </Card>
        </Grid>
      </Grid>
      :
      null
      }
    </Fragment>
  )
}

export default Chatroom

