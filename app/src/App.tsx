import { Box, Container, CssBaseline, Stack, ThemeProvider, Typography, createTheme } from '@mui/material'
import { RouterProvider, createBrowserRouter, Outlet, useParams } from 'react-router-dom'
import { conversionCategories } from './models/unitCatalog'
import { ConverterSection } from './views/ConverterSection'

export type AppContext = { app: string }

const theme = createTheme()

function HomePage() {
  return (
    <Container maxWidth="md">
      <Box component="main" sx={{ py: { xs: 3, sm: 6 } }}>
        <Stack spacing={3}>
          <Stack component="header" spacing={1}>
            <Typography component="h1" variant="h3">
              Converter
            </Typography>
            <Typography color="text.secondary">
              Common conversions without the clutter.
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {conversionCategories.map((category) => (
              <ConverterSection category={category} key={category.id} />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Container>
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
