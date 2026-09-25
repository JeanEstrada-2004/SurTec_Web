import type { NextConfig } from 'next';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0] ?? '';
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrganizationSite =
  repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const basePath =
  isGitHubPagesBuild && repository && !isUserOrOrganizationSite
    ? `/${repository}`
    : '';

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild ? { output: 'export' as const } : {}),
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
