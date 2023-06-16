import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import type { paths } from "@octokit/openapi-types";
import CSS from "./index.css?inline";

type OrgReposResponse =
  paths["/users/{username}/repos"]["get"]["responses"]["200"]["content"]["application/json"];

export const useRepositories = routeLoader$(async ({ params, env }) => {
  console.log('heloooo')
  const response = await fetch(
    `https://api.github.com/users/${params.user}/repos`,
    {
      headers: {
        "User-Agent": "Qwik Workshop",
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: "Bearer " + env.get("PRIVATE_GITHUB_ACCESS_TOKEN"),
      },
    }
  );
  return (await response.json()) as OrgReposResponse;
});

export default component$(() => {
  useStylesScoped$(CSS);
  const repositories = useRepositories()
  const location = useLocation()
  return (
    <div>
      <h1>Repositories</h1>
      <div> User: {location.params.user}</div>
      <ul class="card-list">
        {repositories.value.map((repo) => (
          <li class="card-item" key={repo.full_name}>
            <a href={`/github/${repo.full_name}`}>{repo.full_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
})
