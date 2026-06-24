import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { FileProjectRepository, InMemoryProjectRepository } from '../src/repository';
import { ProjectState } from '../src/types';

function createProjectState(projectId = 'test-project'): ProjectState {
  return {
    project: {
      kind: 'project',
      id: projectId,
      name: 'Test Project',
      version: '1.0.0',
      sourcePath: '/project.yaml',
      agents: [],
      resources: [],
      schedules: [],
    },
    agents: [],
    resources: [],
    artifacts: new Map([
      [
        'artifact-001',
        {
          artifact: {
            id: 'artifact-001',
            projectId,
            type: 'analysis',
            status: 'draft',
            title: 'Artifact',
            content: { score: 5 },
            createdAt: '2026-06-24T00:00:00.000Z',
            createdBy: 'user-001',
            version: 1,
          },
          versions: [
            {
              id: 'artifact-version-001',
              artifactId: 'artifact-001',
              version: 1,
              content: { score: 5 },
              createdAt: '2026-06-24T00:00:00.000Z',
              createdBy: 'user-001',
            },
          ],
          editors: ['user-001'],
          lastModified: '2026-06-24T00:00:00.000Z',
        },
      ],
    ]),
    threads: new Map([
      [
        'thread-001',
        {
          thread: {
            id: 'thread-001',
            projectId,
            status: 'active',
            messages: [],
            createdAt: '2026-06-24T00:00:00.000Z',
            createdBy: 'user-001',
          },
          messageCount: 0,
          participants: ['user-001'],
        },
      ],
    ]),
    runs: new Map([
      [
        'run-001',
        {
          id: 'run-001',
          projectId,
          status: 'succeeded',
          startedAt: '2026-06-24T00:00:00.000Z',
          completedAt: '2026-06-24T00:01:00.000Z',
          targetKind: 'agent',
          targetId: 'agent-001',
          output: { result: 'ok' },
        },
      ],
    ]),
    agentSessions: new Map([
      [
        'session-001',
        {
          id: 'session-001',
          projectId,
          agentId: 'agent-001',
          status: 'idle',
          createdAt: '2026-06-24T00:00:00.000Z',
        },
      ],
    ]),
    participants: new Map([
      [
        'user-001',
        {
          id: 'user-001',
          type: 'human',
          projectId,
          role: 'owner',
          joinedAt: '2026-06-24T00:00:00.000Z',
        },
      ],
    ]),
    events: [
      {
        id: 'event-001',
        name: 'run.succeeded',
        timestamp: '2026-06-24T00:01:00.000Z',
        projectId,
        runId: 'run-001',
      },
    ],
    schedules: [],
    metadata: { source: 'test' },
  };
}

describe('Project repositories', () => {
  describe('InMemoryProjectRepository', () => {
    it('returns defensive copies when loading', async () => {
      const repository = new InMemoryProjectRepository();
      const state = createProjectState();

      await repository.save(state);

      const loaded = await repository.load(state.project.id);
      expect(loaded).toBeDefined();

      loaded!.events.push({
        id: 'event-002',
        name: 'artifact.updated',
        timestamp: '2026-06-24T00:02:00.000Z',
        projectId: state.project.id,
      });

      const reloaded = await repository.load(state.project.id);
      expect(reloaded?.events).toHaveLength(1);
    });
  });

  describe('FileProjectRepository', () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await mkdtemp(path.join(os.tmpdir(), 'awp-runtime-'));
    });

    afterEach(async () => {
      await rm(tempDir, { recursive: true, force: true });
    });

    it('persists and reloads project state', async () => {
      const repository = new FileProjectRepository(tempDir);
      const state = createProjectState();

      await repository.save(state);
      const loaded = await repository.load(state.project.id);

      expect(loaded).toBeDefined();
      expect(loaded?.project.id).toBe(state.project.id);
      expect(loaded?.artifacts.get('artifact-001')?.artifact.title).toBe('Artifact');
      expect(loaded?.runs.get('run-001')?.status).toBe('succeeded');
      expect(loaded?.participants.get('user-001')?.role).toBe('owner');
      expect(loaded?.events[0]?.name).toBe('run.succeeded');
    });

    it('rebuilds projections from canonical events when stored maps drift', async () => {
      const repository = new FileProjectRepository(tempDir);
      const state = createProjectState();

      await repository.save(state);

      const filePath = path.join(tempDir, `${state.project.id}.json`);
      const serialized = JSON.parse(await readFile(filePath, 'utf-8')) as {
        artifacts: Array<[string, { artifact: { title: string; content: Record<string, any> } }]>;
        participants: Array<[string, { role: string }]>;
        events: Array<Record<string, any>>;
      };

      serialized.artifacts[0][1].artifact.title = 'Stale Projection';
      serialized.artifacts[0][1].artifact.content = { score: -1 };
      serialized.participants[0][1].role = 'viewer';
      serialized.events = [
        {
          id: 'event-001',
          name: 'participant.joined',
          timestamp: '2026-06-24T00:00:00.000Z',
          projectId: state.project.id,
          participantId: 'user-001',
          payload: {
            participant: {
              id: 'user-001',
              type: 'human',
              projectId: state.project.id,
              role: 'owner',
              joinedAt: '2026-06-24T00:00:00.000Z',
            },
          },
        },
        {
          id: 'event-002',
          name: 'artifact.created',
          timestamp: '2026-06-24T00:00:00.000Z',
          projectId: state.project.id,
          artifactId: 'artifact-001',
          payload: {
            record: {
              artifact: {
                id: 'artifact-001',
                projectId: state.project.id,
                type: 'analysis',
                status: 'draft',
                title: 'Artifact',
                content: { score: 5 },
                createdAt: '2026-06-24T00:00:00.000Z',
                createdBy: 'user-001',
                version: 1,
              },
              versions: [
                {
                  id: 'artifact-version-001',
                  artifactId: 'artifact-001',
                  version: 1,
                  content: { score: 5 },
                  createdAt: '2026-06-24T00:00:00.000Z',
                  createdBy: 'user-001',
                },
              ],
              editors: ['user-001'],
              lastModified: '2026-06-24T00:00:00.000Z',
            },
          },
        },
      ];

      await writeFile(filePath, JSON.stringify(serialized, null, 2), 'utf-8');

      const loaded = await repository.load(state.project.id);

      expect(loaded?.artifacts.get('artifact-001')?.artifact.title).toBe('Artifact');
      expect(loaded?.artifacts.get('artifact-001')?.artifact.content).toEqual({ score: 5 });
      expect(loaded?.participants.get('user-001')?.role).toBe('owner');
    });

    it('lists and deletes persisted projects', async () => {
      const repository = new FileProjectRepository(tempDir);
      const first = createProjectState('project-a');
      const second = createProjectState('project-b');

      await repository.save(first);
      await repository.save(second);

      expect(await repository.list()).toEqual(['project-a', 'project-b']);

      await repository.delete('project-a');

      expect(await repository.list()).toEqual(['project-b']);
      expect(await repository.load('project-a')).toBeUndefined();
    });
  });
});
