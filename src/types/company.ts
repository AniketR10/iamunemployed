export interface Company {
    id: string;
    slug: string;
    title: string;
    website: string;
    careers_url: string;
    region: string;
    remote_policy: string;
    company_size?: string;
    technologies?: string[];
    company_blurb?: string;
    remote_status?: string;
    company_technologies: string;
    office_locations?: string;
    how_to_apply?: string;

}