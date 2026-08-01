import {
  Box,
  Container,
  CssBaseline,
  Link,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { RouterProvider, createBrowserRouter, Outlet, useParams } from 'react-router-dom'
import Footer from './components/Footer'
import { conversionCategories } from './models/unitCatalog'
import { ConverterSection } from './views/ConverterSection'
import { TimeZoneSection } from './views/TimeZoneSection'

export type AppContext = { app: string }

const theme = createTheme()
const coreCategories = conversionCategories.slice(0, 3)
const milestoneThreeCategories = conversionCategories.slice(3)
const toolLinks = [
  ...coreCategories.map(({ title }) => title),
  'Time zones',
  ...milestoneThreeCategories.map(({ title }) => title),
]

function HomePage() {
  return (
    <>
      <Container maxWidth="md">
        <Box component="main" sx={{ py: { xs: 3, sm: 6 } }}>
          <Stack spacing={3}>
            <Stack component="header" spacing={2}>
              <Typography component="h1" variant="h3">
                Converter
              </Typography>
              <Stack
                aria-label="Converter tools"
                component="nav"
                direction="row"
                flexWrap="wrap"
                spacing={2}
                useFlexGap
              >
                {toolLinks.map((title) => (
                  <Link href={`#${title.toLowerCase().replaceAll(' ', '-')}`} key={title}>
                    {title}
                  </Link>
                ))}
              </Stack>
            </Stack>

            <Stack spacing={1}>
              {coreCategories.map((category) => (
                <ConverterSection category={category} key={category.id} />
              ))}
              <TimeZoneSection />
              {milestoneThreeCategories.map((category) => (
                <ConverterSection category={category} key={category.id} />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
      <Footer />
    </>
  )
}

function AppLayout() {
  const { app = '' } = useParams()
  return <Outlet context={{ app } satisfies AppContext} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: ':app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
])

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
