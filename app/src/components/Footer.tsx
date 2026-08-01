import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { Container, Link, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Container maxWidth={false} sx={{ width: '90%', mx: 'auto', py: 3 }}>
      <Typography variant="body2">
        Built by John Pfeiffer{' '}
        <Link
          aria-label="John Pfeiffer on LinkedIn"
          color="inherit"
          href="https://www.linkedin.com/in/foupfeiffer"
          rel="noopener noreferrer"
          sx={{ display: 'inline-flex', verticalAlign: 'text-bottom' }}
          target="_blank"
          underline="hover"
        >
          <LinkedInIcon />
        </Link>{' '}
        <Link
          aria-label="Source code on GitHub"
          color="inherit"
          href="https://github.com/johnpfeiffer/converter"
          rel="noopener noreferrer"
          sx={{ display: 'inline-flex', verticalAlign: 'text-bottom' }}
          target="_blank"
          underline="hover"
        >
          <GitHubIcon />
        </Link>
      </Typography>
    </Container>
  )
}
