// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'

// ** Hooks
import { useSettings } from '@core/hooks/useSettings'

// ** Third Party Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'

// ** Axios Imports
import { useAuth } from '@/hooks/useAuth'
import authConfig from '@configs/auth'

import { GetMyLastMsg } from '@/functions/AoConnect/AoConnect'
import { MyProcessTxIdsGetTokens, MyProcessTxIdsAddToken, MyProcessTxIdsDelToken } from '@/functions/AoConnect/MyProcessTxIds'

import TokenLeft from '@views/Token/TokenLeft'
import TokenIndex from '@views/Token/TokenIndex'
import TokenHelpText from '@views/Help/Token'

import { ansiRegex } from '@configs/functions'
import { AoCreateProcessAuto } from '@/functions/AoConnect/AoConnect'
import { GetAoConnectMyAoConnectTxId, SetAoConnectMyAoConnectTxId } from '@/functions/AoConnect/MsgReminder'

const TokenModel = () => {
  // ** Hook

  // ** States

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  const tokenLeftWidth = smAbove ? 270 : 200
  const { skin } = settings

  const auth = useAuth()
  const [currentAddress, setCurrentAddress] = useState<string>("")
  useEffect(()=>{
    if(auth && auth.connected == false) {
        setLoadingWallet(2)
    }
    if(auth && auth.connected == true && auth.address && auth.address.length == 43) {
        setLoadingWallet(1)
        setCurrentAddress(auth.address)
    }
  }, [auth])

  const [windowWidth, setWindowWidth] = useState('1152px');
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth >=1920)   {
        setWindowWidth('1392px');
      }
      else if(window.innerWidth < 1920 && window.innerWidth > 1440)   {
        setWindowWidth('1152px');
      }
      else if(window.innerWidth <= 1440 && window.innerWidth > 1200)   {
        setWindowWidth('1152px');
      }
      else if(window.innerWidth <= 1200 && window.innerWidth > 900)   {
        setWindowWidth('852px');
      }
      else if(window.innerWidth <= 900)   {
        setWindowWidth('90%');
      }
      console.log("window.innerWidth1 ", window.innerWidth)
      console.log("window.windowWidth2 ", windowWidth)
    };
    
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const [loadingWallet, setLoadingWallet] = useState<number>(0)

  const [tokenLeft, setTokenLeft] = useState<any[]>([])
  const [counter, setCounter] = useState<number>(0)
  const [searchToken, setSearchToken] = useState<string>('')
  const [loadingGetTokens, setLoadingGetTokens] = useState<boolean>(true)
  const [addTokenButtonText, setAddTokenButtonText] = useState<string>('Add Favorite')
  const [addTokenButtonDisabled, setAddTokenButtonDisabled] = useState<boolean>(false)
  const [addTokenFavorite, setAddTokenFavorite] = useState<boolean>(false)
  const [tokenCreate, setTokenCreate] = useState<any>({ openCreateToken: false, FormSubmit: 'Submit', isDisabledButton: false })
  const [tokenGetInfor, setTokenGetInfor] = useState<any>({ openSendOutToken: false, disabledSendOutButton:false, FormSubmit: 'Submit', isDisabledButton: false, isLoading: false })
  
  const [cancelTokenButtonText, setCancelTokenButtonText] = useState<string>('Cancel Favorite')
  const [cancelTokenButtonDisabled, setCancelTokenButtonDisabled] = useState<boolean>(false)
  const [cancelTokenFavorite, setCancelTokenFavorite] = useState<boolean>(false)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [pageCount, setPageCount] = useState<number>(0)

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  
  const [myAoConnectTxId, setMyAoConnectTxId] = useState<string>('')
  useEffect(() => {
    const fetchData = async () => {
        if(currentAddress && currentAddress.length === 43) {
            const MyProcessTxIdData: string = GetAoConnectMyAoConnectTxId(currentAddress);
            if(MyProcessTxIdData && MyProcessTxIdData.length === 43) {
                setMyAoConnectTxId(MyProcessTxIdData);
            }
            if(MyProcessTxIdData === '') {
                const ChivesMyAoConnectProcessTxId = await AoCreateProcessAuto(globalThis.arweaveWallet);
                if(ChivesMyAoConnectProcessTxId) {
                    console.log("ChivesMyAoConnectProcessTxId", ChivesMyAoConnectProcessTxId);
                    SetAoConnectMyAoConnectTxId(currentAddress, ChivesMyAoConnectProcessTxId);
                    setMyAoConnectTxId(ChivesMyAoConnectProcessTxId);
                }
            }
        }
    };
    fetchData();
  }, [currentAddress]);

  useEffect(() => {
    if(myAoConnectTxId && myAoConnectTxId.length == 43 && currentAddress && currentAddress.length == 43 && myAoConnectTxId!= currentAddress ) {      
      handleGetTokenInfo()
    }
  }, [myAoConnectTxId, counter, currentAddress])


  const handleGetTokenInfo = async () => {
    setLoadingGetTokens(true)
    const MyProcessTxIdsGetTokensData = await MyProcessTxIdsGetTokens(authConfig.AoConnectMyProcessTxIds, currentAddress);
    if (MyProcessTxIdsGetTokensData) {
        const TokenList = Object.values(MyProcessTxIdsGetTokensData);
        if (TokenList) {
            const filteredTokens = TokenList.filter((token: any) => token && token?.TokenData && token?.TokenId && token?.TokenId?.length == 43);
            const filteredTokensData = filteredTokens.map((token: any) => {
              try {
                  const parsedTokenData = JSON.parse(token.TokenData);

                  return { ...token, TokenData: parsedTokenData };
              } 
              catch (error) {

                  return { ...token, TokenData: null };
              }
            });
            const filteredTokensDataNew = filteredTokensData.filter((token: any) => token.TokenData);
            filteredTokensDataNew.sort((a: any, b: any) => {
              return Number(a.TokenSort) - Number(b.TokenSort);
            });
            if (filteredTokensDataNew.length > 0) {
              setTokenLeft(filteredTokensDataNew);
            }
        }
    }
    setLoadingGetTokens(false)
  }

  const handleAddToken = async (WantToSaveTokenProcessTxId: string) => {
    if(tokenInfo)  {
      setAddTokenButtonDisabled(true)
      setAddTokenButtonText('waiting')
      const WantToSaveTokenProcessTxIdData = await MyProcessTxIdsAddToken(globalThis.arweaveWallet, authConfig.AoConnectMyProcessTxIds, WantToSaveTokenProcessTxId, tokenGetInfor?.Sort ?? '10', 'My Tokens', JSON.stringify(tokenInfo).replace(/"/g, '\\"') )
      if(WantToSaveTokenProcessTxIdData) {
        setAddTokenButtonText('Have add')
        console.log("WantToSaveTokenProcessTxIdData", WantToSaveTokenProcessTxIdData)
        if(WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output)  {
          setCounter(counter + 1)
          const formatText = WantToSaveTokenProcessTxIdData?.msg?.Output?.data?.output.replace(ansiRegex, '');
          if(formatText) {
            const MyProcessTxIdsAddTokenData1 = await GetMyLastMsg(globalThis.arweaveWallet, WantToSaveTokenProcessTxId)
            if(MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output)  {
              const formatText2 = MyProcessTxIdsAddTokenData1?.msg?.Output?.data?.output.replace(ansiRegex, '');
              if(formatText2) {
                toast.success(formatText2, {
                  duration: 2000
                })
              }
            }

          }

        }
      }
    }
  }

  const handleCancelFavoriteToken = async (WantToSaveTokenProcessTxId: string) => {
    setCancelTokenButtonDisabled(true)
    setCancelTokenButtonText('waiting')
    const WantToCancelTokenProcessTxIdData = await MyProcessTxIdsDelToken(globalThis.arweaveWallet, authConfig.AoConnectMyProcessTxIds, WantToSaveTokenProcessTxId)
    if(WantToCancelTokenProcessTxIdData) {
      console.log("WantToCancelTokenProcessTxIdData", WantToCancelTokenProcessTxIdData)
      if(WantToCancelTokenProcessTxIdData?.msg?.Messages && WantToCancelTokenProcessTxIdData?.msg?.Messages[0]?.Data)  {
        setCounter(counter + 1)
        setCancelTokenButtonText('Have cancel')
        toast.success(WantToCancelTokenProcessTxIdData?.msg?.Messages[0]?.Data, {
          duration: 2000
        })
      }
    }
  }
  
  return (
    <Grid container sx={{margin: '0 auto'}} maxWidth={windowWidth}>
      {loadingWallet == 0 && (
          <Grid container spacing={5}>
            <Grid item xs={12} justifyContent="center">
              <Card sx={{ my: 6, width: '100%', height: '800px' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  Loading Wallet Status
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      )}
      {loadingWallet == 2 && (
          <Grid container spacing={5}>
            <Grid item xs={12} justifyContent="center">
              <Card sx={{ my: 6, width: '100%', height: '800px' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <TokenHelpText />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      )}
      {loadingWallet == 1 && (
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '800px',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          my: 6,
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >

        <Fragment>
          <TokenLeft
            myAoConnectTxId={myAoConnectTxId}
            hidden={hidden}
            mdAbove={mdAbove}
            tokenLeftWidth={tokenLeftWidth}
            tokenLeft={tokenLeft}
            searchToken={searchToken}
            setSearchToken={setSearchToken}
            loadingGetTokens={loadingGetTokens}
            setAddTokenButtonText={setAddTokenButtonText}
            setAddTokenButtonDisabled={setAddTokenButtonDisabled}
            addTokenFavorite={addTokenFavorite}
            setAddTokenFavorite={setAddTokenFavorite}
            tokenCreate={tokenCreate}
            setTokenCreate={setTokenCreate}
            leftSidebarOpen={leftSidebarOpen}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            setTokenGetInfor={setTokenGetInfor}
            setCancelTokenFavorite={setCancelTokenFavorite}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
          {myAoConnectTxId && myAoConnectTxId.length == 43 && (
            <TokenIndex 
              myAoConnectTxId={myAoConnectTxId}
              tokenLeft={tokenLeft}
              tokenInfo={tokenInfo}
              setTokenInfo={setTokenInfo}
              handleAddToken={handleAddToken}
              handleCancelFavoriteToken={handleCancelFavoriteToken}
              searchToken={searchToken}
              setSearchToken={setSearchToken}
              addTokenButtonText={addTokenButtonText}
              addTokenButtonDisabled={addTokenButtonDisabled}
              addTokenFavorite={addTokenFavorite}
              tokenCreate={tokenCreate}
              setTokenCreate={setTokenCreate}
              counter={counter}
              setCounter={setCounter}
              tokenGetInfor={tokenGetInfor}
              setTokenGetInfor={setTokenGetInfor}
              setAddTokenFavorite={setAddTokenFavorite}
              setAddTokenButtonText={setAddTokenButtonText}
              setAddTokenButtonDisabled={setAddTokenButtonDisabled}
              cancelTokenButtonText={cancelTokenButtonText}
              cancelTokenButtonDisabled={cancelTokenButtonDisabled}
              cancelTokenFavorite={cancelTokenFavorite}
              setCancelTokenFavorite={setCancelTokenFavorite}
              setCancelTokenButtonText={setCancelTokenButtonText}
              setCancelTokenButtonDisabled={setCancelTokenButtonDisabled}
              pageCount={pageCount}
              setPageCount={setPageCount}
            />
          )}
        </Fragment>

      </Box>
      )}
    </Grid>
  )
}

export default TokenModel
